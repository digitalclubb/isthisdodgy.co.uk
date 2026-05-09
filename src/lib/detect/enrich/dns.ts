import { promises as dns } from 'node:dns';
import type { EnrichmentResult } from '../verdict.ts';
import { cached } from './runner.ts';

const HOST_RE = /^[a-z0-9.-]+$/i;

export async function dnsEnricher(
	hostname: string,
	signal: AbortSignal
): Promise<EnrichmentResult> {
	const host = hostname.toLowerCase().trim();
	if (!HOST_RE.test(host) || host.length > 253) {
		return { source: 'dns', reasons: [], skipped: true };
	}
	return cached(`dns:${host}`, 60 * 60 * 6, () => probe(host, signal));
}

async function probe(host: string, signal: AbortSignal): Promise<EnrichmentResult> {
	if (signal.aborted) return { source: 'dns', reasons: [], failed: true };

	// Per-resolver timeout is short so the parent enricher timeout stays
	// authoritative. node:dns doesn't accept an AbortSignal directly, so we
	// race the resolver against the upstream signal manually.
	const resolver = new dns.Resolver({ timeout: 700, tries: 1 });
	const aborted = new Promise<boolean>((resolve) => {
		signal.addEventListener('abort', () => resolve(false), { once: true });
	});

	let resolved = false;
	try {
		const r = await Promise.race([
			Promise.any([resolver.resolve4(host), resolver.resolve6(host)]).then(
				(addrs) => Array.isArray(addrs) && addrs.length > 0
			),
			aborted
		]);
		resolved = r === true;
	} catch {
		resolved = false;
	}

	if (!resolved) {
		return {
			source: 'dns',
			reasons: [
				{
					text: "The website's address doesn't currently resolve. It may have been taken down or never existed.",
					weight: 25,
					source: 'dns'
				}
			],
			meta: { resolves: false }
		};
	}

	let mxFound = false;
	if (!signal.aborted) {
		try {
			const mx = await Promise.race([resolver.resolveMx(host), aborted.then(() => null)]);
			mxFound = Array.isArray(mx) && mx.length > 0;
		} catch {
			mxFound = false;
		}
	}

	return {
		source: 'dns',
		reasons: [],
		meta: { resolves: true, mx: mxFound }
	};
}
