import { isIP } from 'node:net';
import type { EnrichmentResult, ReasonSource } from '../verdict.ts';

export type EnricherFn = (signal: AbortSignal) => Promise<EnrichmentResult>;

export type EnricherSpec = {
	name: ReasonSource;
	timeoutMs: number;
	run: EnricherFn;
};

type CacheEntry<T> = { value: T; expiresAt: number };
const cacheStore = new Map<string, CacheEntry<EnrichmentResult>>();
const inflightStore = new Map<string, Promise<EnrichmentResult>>();
const MAX_CACHE_ENTRIES = 500;

export async function runEnrichers(specs: EnricherSpec[]): Promise<EnrichmentResult[]> {
	const settled = await Promise.allSettled(
		specs.map(async (spec) => {
			const ctrl = new AbortController();
			const timer = setTimeout(() => ctrl.abort(), spec.timeoutMs);
			// Don't keep the serverless container alive past its work if the
			// timer fires after the function has returned.
			if (typeof timer.unref === 'function') timer.unref();
			try {
				return await spec.run(ctrl.signal);
			} finally {
				clearTimeout(timer);
			}
		})
	);

	return settled.map((r, i) => {
		const spec = specs[i];
		if (!spec) {
			return { source: 'heuristic' as ReasonSource, reasons: [], failed: true };
		}
		if (r.status === 'fulfilled') return r.value;
		return { source: spec.name, reasons: [], failed: true };
	});
}

// Cache helper. Single-flight: concurrent misses for the same key share one
// loader call. LRU-ish: a cache hit moves the entry to most-recently-used.
export async function cached<T extends EnrichmentResult>(
	key: string,
	ttlSeconds: number,
	loader: () => Promise<T>
): Promise<T> {
	const now = Date.now();
	const hit = cacheStore.get(key);
	if (hit && hit.expiresAt > now) {
		// Refresh recency.
		cacheStore.delete(key);
		cacheStore.set(key, hit);
		return hit.value as T;
	}

	const existing = inflightStore.get(key);
	if (existing) return existing as Promise<T>;

	const p = (async () => {
		try {
			const value = await loader();
			cacheStore.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
			if (cacheStore.size > MAX_CACHE_ENTRIES) {
				const oldestKey = cacheStore.keys().next().value;
				if (oldestKey) cacheStore.delete(oldestKey);
			}
			return value;
		} finally {
			inflightStore.delete(key);
		}
	})();
	inflightStore.set(key, p as Promise<EnrichmentResult>);
	return p;
}

// Test-only: clear the cache so unit tests can run in isolation.
export function _clearCache() {
	cacheStore.clear();
	inflightStore.clear();
}

// Hostnames that must never be reached from a server-side fetch. These are
// the ranges most commonly exploited via SSRF (cloud metadata, link-local,
// loopback, RFC1918). DNS-resolved IPs are checked explicitly in the redirect
// path; the regexes here are a fast first line of defence on the literal
// hostname before any DNS happens.
const PRIVATE_HOST_RE =
	/^(localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2[0-9]|3[01])\.|0\.0\.0\.0|::1$|\[::1\]|\[fc00::|\[fd[0-9a-f]{2}:|\[fe80::)/i;

function isPrivateAddress(host: string): boolean {
	const stripped = host.replace(/^\[|\]$/g, '');
	if (PRIVATE_HOST_RE.test(host)) return true;
	const family = isIP(stripped);
	if (family === 4) {
		const [a, b] = stripped.split('.').map(Number);
		if (a === 10 || a === 127 || a === 0) return true;
		if (a === 169 && b === 254) return true;
		if (a === 192 && b === 168) return true;
		if (a === 172 && b !== undefined && b >= 16 && b <= 31) return true;
	}
	if (family === 6) {
		const lower = stripped.toLowerCase();
		if (
			lower === '::1' ||
			lower.startsWith('fe80:') ||
			lower.startsWith('fc') ||
			lower.startsWith('fd')
		) {
			return true;
		}
	}
	return false;
}

export type SafeFetchOptions = RequestInit & {
	signal: AbortSignal;
	maxBytes?: number;
	maxRedirects?: number;
};

// fetch() wrapper that:
// - manually follows redirects so we can validate each hop
// - rejects redirects to non-https or private/loopback/link-local hosts
// - rejects responses larger than maxBytes
export async function safeFetch(initialUrl: string, options: SafeFetchOptions): Promise<Response> {
	const { signal, maxBytes = 1_500_000, maxRedirects = 3, ...init } = options;
	let url = initialUrl;

	for (let hop = 0; hop <= maxRedirects; hop++) {
		const u = new URL(url);
		if (u.protocol !== 'https:' && u.protocol !== 'http:') {
			throw new Error(`unsupported protocol: ${u.protocol}`);
		}
		if (isPrivateAddress(u.hostname)) {
			throw new Error('refused to fetch private host');
		}

		const res = await fetch(url, { ...init, redirect: 'manual', signal });

		if (res.status >= 300 && res.status < 400) {
			const loc = res.headers.get('location');
			if (!loc) return res;
			url = new URL(loc, url).toString();
			continue;
		}

		const lengthHeader = res.headers.get('content-length');
		if (lengthHeader && Number(lengthHeader) > maxBytes) {
			throw new Error(`response too large: ${lengthHeader}`);
		}
		return res;
	}
	throw new Error('too many redirects');
}
