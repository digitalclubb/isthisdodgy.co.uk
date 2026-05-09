import type { EnrichmentResult, Reason } from '../verdict.ts';
import { ipqsCircuitOpen, ipqsNoteFailure } from './ipqs-shared.ts';
import { cached, safeFetch } from './runner.ts';

const VALID_EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i;

type IpqsEmailResponse = {
	success?: boolean;
	message?: string;
	valid?: boolean;
	disposable?: boolean;
	deliverability?: 'low' | 'medium' | 'high';
	dns_valid?: boolean;
	honeypot?: boolean;
	frequent_complainer?: boolean;
	suspect?: boolean;
	recent_abuse?: boolean;
	leaked?: boolean;
	fraud_score?: number;
	overall_score?: number;
	suggested_domain?: string;
	domain_age?: { iso?: string; human?: string };
};

export async function ipqsEmailEnricher(
	email: string,
	signal: AbortSignal
): Promise<EnrichmentResult> {
	const key = process.env.IPQS_KEY;
	if (!key) return { source: 'ipqs', reasons: [], skipped: true };
	const clean = email.toLowerCase().trim();
	if (!VALID_EMAIL_RE.test(clean)) return { source: 'ipqs', reasons: [], skipped: true };
	if (ipqsCircuitOpen('email')) return { source: 'ipqs', reasons: [], skipped: true };
	return cached(`ipqs-email:${clean}`, 60 * 60 * 6, () => lookup(clean, key, signal));
}

async function lookup(email: string, key: string, signal: AbortSignal): Promise<EnrichmentResult> {
	const url = `https://www.ipqualityscore.com/api/json/email/${encodeURIComponent(key)}/${encodeURIComponent(email)}`;
	let res: Response;
	try {
		res = await safeFetch(url, { signal });
	} catch {
		return { source: 'ipqs', reasons: [], failed: true };
	}
	if (!res.ok) return { source: 'ipqs', reasons: [], failed: true };

	let data: IpqsEmailResponse;
	try {
		data = (await res.json()) as IpqsEmailResponse;
	} catch {
		return { source: 'ipqs', reasons: [], failed: true };
	}
	if (data.success === false) {
		ipqsNoteFailure('email');
		return { source: 'ipqs', reasons: [], failed: true };
	}

	const reasons: Reason[] = [];

	if (data.honeypot) {
		reasons.push({
			text: 'IPQualityScore says this address is a known honeypot used to catch spammers.',
			weight: 60,
			source: 'ipqs'
		});
	}
	if (data.recent_abuse) {
		reasons.push({
			text: 'IPQualityScore has linked this address to abusive activity recently.',
			weight: 50,
			source: 'ipqs'
		});
	}
	if (data.suspect) {
		reasons.push({
			text: 'IPQualityScore flags this address as suspicious based on its history.',
			weight: 25,
			source: 'ipqs'
		});
	}
	if (data.disposable) {
		reasons.push({
			text: 'IPQualityScore confirms this is a disposable email address.',
			weight: 30,
			source: 'ipqs'
		});
	}
	if (data.leaked) {
		reasons.push({
			text: 'This address has appeared in a known data breach. If this is your address, consider changing the password.',
			weight: 0,
			source: 'ipqs'
		});
	}
	if (data.frequent_complainer) {
		reasons.push({
			text: 'This address has been reported by other recipients as unwanted mail.',
			weight: 10,
			source: 'ipqs'
		});
	}

	const fraud = data.fraud_score ?? 0;
	// Suppress the generic fraud-score reason when a specific category already
	// fired, so we don't double-count the same underlying signal.
	const flaggedSpecific = data.honeypot || data.recent_abuse || data.suspect || data.disposable;
	if (!flaggedSpecific) {
		if (fraud >= 90) {
			reasons.push({
				text: `IPQualityScore rates this address as very high risk (${fraud}/100).`,
				weight: 40,
				source: 'ipqs'
			});
		} else if (fraud >= 75) {
			reasons.push({
				text: `IPQualityScore rates this address as high risk (${fraud}/100).`,
				weight: 25,
				source: 'ipqs'
			});
		}
	}

	// Validity is already covered by EmailRep and our heuristic checks, so
	// don't restate it here.

	return {
		source: 'ipqs',
		reasons,
		meta: {
			fraud_score: data.fraud_score,
			recent_abuse: data.recent_abuse,
			honeypot: data.honeypot,
			suspect: data.suspect,
			disposable: data.disposable,
			leaked: data.leaked,
			deliverability: data.deliverability,
			suggested_domain: data.suggested_domain
		}
	};
}
