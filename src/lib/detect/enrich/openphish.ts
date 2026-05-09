import type { EnrichmentResult } from '../verdict.ts';

const FEED_URL = 'https://openphish.com/feed.txt';
const FEED_TTL_MS = 12 * 60 * 60 * 1000;
const FEED_MAX_BYTES = 5 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 5000;
const NEGATIVE_CACHE_MS = 60_000;

type FeedState = {
	urls: Set<string>;
	hosts: Set<string>;
	loadedAt: number;
};

// Module-level singletons. On Vercel, lifetime equals the warm container.
// Cold starts will refetch the feed. That's an acceptable compromise without
// a shared key-value store.
let feedState: FeedState | null = null;
let inflight: Promise<FeedState | null> | null = null;
let lastFailureAt = 0;

async function loadFeed(): Promise<FeedState | null> {
	if (feedState && Date.now() - feedState.loadedAt < FEED_TTL_MS) return feedState;
	if (Date.now() - lastFailureAt < NEGATIVE_CACHE_MS) return feedState;
	if (inflight) return inflight;

	inflight = (async () => {
		const ctrl = new AbortController();
		const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
		if (typeof timer.unref === 'function') timer.unref();
		try {
			const res = await fetch(FEED_URL, {
				signal: ctrl.signal,
				headers: { Accept: 'text/plain' }
			});
			if (!res.ok) {
				lastFailureAt = Date.now();
				return feedState;
			}

			const lengthHeader = res.headers.get('content-length');
			if (lengthHeader && Number(lengthHeader) > FEED_MAX_BYTES) {
				lastFailureAt = Date.now();
				return feedState;
			}

			// Stream-read with a byte counter so we don't load arbitrary
			// payloads into memory if Content-Length is missing or wrong.
			const reader = res.body?.getReader();
			if (!reader) {
				lastFailureAt = Date.now();
				return feedState;
			}
			const decoder = new TextDecoder();
			let acc = '';
			let bytes = 0;
			while (true) {
				const { value, done } = await reader.read();
				if (done) break;
				bytes += value.byteLength;
				if (bytes > FEED_MAX_BYTES) {
					await reader.cancel();
					lastFailureAt = Date.now();
					return feedState;
				}
				acc += decoder.decode(value, { stream: true });
			}
			acc += decoder.decode();

			const urls = new Set<string>();
			const hosts = new Set<string>();
			for (const line of acc.split('\n')) {
				const trimmed = line.trim();
				if (!trimmed || !/^https?:\/\//i.test(trimmed)) continue;
				urls.add(trimmed);
				try {
					hosts.add(new URL(trimmed).hostname.toLowerCase());
				} catch {
					/* skip malformed entries */
				}
			}
			feedState = { urls, hosts, loadedAt: Date.now() };
			return feedState;
		} catch {
			lastFailureAt = Date.now();
			return feedState;
		} finally {
			clearTimeout(timer);
			inflight = null;
		}
	})();
	return inflight;
}

export async function openphishEnricher(
	href: string,
	hostname: string,
	signal: AbortSignal
): Promise<EnrichmentResult> {
	if (!/^https?:\/\//i.test(href)) {
		return { source: 'openphish', reasons: [], skipped: true };
	}
	if (signal.aborted) return { source: 'openphish', reasons: [], failed: true };

	const feed = await loadFeed();
	if (!feed) return { source: 'openphish', reasons: [], failed: true };

	const exactMatch = feed.urls.has(href);
	const hostMatch = !exactMatch && feed.hosts.has(hostname.toLowerCase());

	if (exactMatch) {
		return {
			source: 'openphish',
			reasons: [
				{
					text: 'OpenPhish has logged this exact link as a phishing attempt.',
					weight: 80,
					source: 'openphish'
				}
			],
			meta: { match: 'url', feedAge: Date.now() - feed.loadedAt }
		};
	}
	if (hostMatch) {
		return {
			source: 'openphish',
			reasons: [
				{
					text: 'OpenPhish has logged phishing pages on this same web address.',
					weight: 60,
					source: 'openphish'
				}
			],
			meta: { match: 'host', feedAge: Date.now() - feed.loadedAt }
		};
	}
	return { source: 'openphish', reasons: [], meta: { match: false } };
}

// Test-only: clear cached feed state.
export function _clearFeed() {
	feedState = null;
	inflight = null;
	lastFailureAt = 0;
}
