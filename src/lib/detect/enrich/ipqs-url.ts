import type { EnrichmentResult, Reason } from '../verdict.ts';
import { ipqsCircuitOpen, ipqsNoteFailure } from './ipqs-shared.ts';
import { cached, safeFetch } from './runner.ts';

type IpqsUrlResponse = {
	success?: boolean;
	message?: string;
	unsafe?: boolean;
	risk_score?: number;
	malware?: boolean;
	phishing?: boolean;
	spamming?: boolean;
	suspicious?: boolean;
	parking?: boolean;
	adult?: boolean;
	dns_valid?: boolean;
	category?: string;
	domain_rank?: number;
	domain_age?: { iso?: string; human?: string };
};

export async function ipqsUrlEnricher(
	href: string,
	signal: AbortSignal
): Promise<EnrichmentResult> {
	const key = process.env.IPQS_KEY;
	if (!key) return { source: 'ipqs', reasons: [], skipped: true };
	if (!/^https?:\/\//i.test(href)) return { source: 'ipqs', reasons: [], skipped: true };
	if (ipqsCircuitOpen('url')) return { source: 'ipqs', reasons: [], skipped: true };
	// Normalise the cache key: lowercase the origin (URLs are case-insensitive
	// on host) but preserve path case (paths are case-sensitive on most
	// servers). This avoids billing IPQS twice for "Example.com/Foo" vs
	// "example.com/Foo" while not collapsing distinct paths.
	const normalisedKey = normaliseHrefForCache(href);
	return cached(`ipqs-url:${normalisedKey}`, 60 * 60 * 6, () => lookup(href, key, signal));
}

function normaliseHrefForCache(href: string): string {
	try {
		const u = new URL(href);
		u.hostname = u.hostname.toLowerCase();
		u.hash = '';
		return u.href;
	} catch {
		return href;
	}
}

async function lookup(href: string, key: string, signal: AbortSignal): Promise<EnrichmentResult> {
	const url = `https://www.ipqualityscore.com/api/json/url/${encodeURIComponent(key)}/${encodeURIComponent(href)}`;
	let res: Response;
	try {
		res = await safeFetch(url, { signal });
	} catch {
		return { source: 'ipqs', reasons: [], failed: true };
	}
	if (!res.ok) return { source: 'ipqs', reasons: [], failed: true };

	let data: IpqsUrlResponse;
	try {
		data = (await res.json()) as IpqsUrlResponse;
	} catch {
		return { source: 'ipqs', reasons: [], failed: true };
	}
	if (data.success === false) {
		ipqsNoteFailure('url');
		return { source: 'ipqs', reasons: [], failed: true };
	}

	const reasons: Reason[] = [];
	if (data.malware) {
		reasons.push({
			text: 'IPQualityScore flags this site as hosting malware.',
			weight: 80,
			source: 'ipqs'
		});
	}
	if (data.phishing) {
		reasons.push({
			text: 'IPQualityScore flags this site as a phishing page.',
			weight: 80,
			source: 'ipqs'
		});
	}
	if (data.spamming) {
		reasons.push({
			text: 'IPQualityScore flags this site for sending spam.',
			weight: 40,
			source: 'ipqs'
		});
	}
	if (data.parking) {
		reasons.push({
			text: 'IPQualityScore says this domain is parked. Real businesses rarely run parked sites.',
			weight: 10,
			source: 'ipqs'
		});
	}
	if (data.suspicious && !data.malware && !data.phishing && !data.spamming) {
		reasons.push({
			text: 'IPQualityScore flags this site as suspicious.',
			weight: 20,
			source: 'ipqs'
		});
	}

	const risk = data.risk_score ?? 0;
	// Only emit a generic risk-score reason when no specific category fired,
	// so a parked-and-spammy site doesn't get its weight counted twice.
	const flaggedSpecific =
		data.malware || data.phishing || data.spamming || data.parking || data.suspicious;
	if (!flaggedSpecific) {
		// Calibration: a third-party score on its own should not push a verdict
		// to "dodgy" without corroborating evidence. We weight conservatively
		// so IPQS contributes meaningfully to a stack of signals but rarely
		// dominates.
		if (risk >= 90) {
			reasons.push({
				text: `IPQualityScore rates this address as very high risk (${risk}/100).`,
				weight: 35,
				source: 'ipqs'
			});
		} else if (risk >= 75) {
			reasons.push({
				text: `IPQualityScore rates this address as high risk (${risk}/100).`,
				weight: 25,
				source: 'ipqs'
			});
		} else if (risk >= 50) {
			reasons.push({
				text: `IPQualityScore rates this address as moderate risk (${risk}/100).`,
				weight: 10,
				source: 'ipqs'
			});
		} else if (
			risk <= 10 &&
			data.dns_valid !== false &&
			!data.parking &&
			!data.suspicious &&
			(data.domain_rank ?? 0) > 0 &&
			(data.domain_rank ?? 0) < 10000
		) {
			reasons.push({
				text: 'IPQualityScore finds a clean record for this site.',
				weight: -10,
				source: 'ipqs'
			});
		}
	}

	return {
		source: 'ipqs',
		reasons,
		meta: {
			risk_score: data.risk_score,
			malware: data.malware,
			phishing: data.phishing,
			spamming: data.spamming,
			parking: data.parking,
			suspicious: data.suspicious,
			category: data.category
		}
	};
}
