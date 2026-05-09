import type { EnrichmentResult, Reason } from '../verdict.ts';
import { ipqsCircuitOpen, ipqsNoteFailure } from './ipqs-shared.ts';
import { cached, safeFetch } from './runner.ts';

// Locks the cache key, the URL path component and the IPQS contract together:
// only well-formed E.164 input is ever sent on the wire.
const E164_RE = /^\+\d{6,15}$/;

type IpqsPhoneResponse = {
	success?: boolean;
	message?: string;
	formatted?: string;
	local_format?: string;
	valid?: boolean;
	fraud_score?: number;
	recent_abuse?: boolean;
	risky?: boolean;
	VOIP?: boolean;
	prepaid?: boolean;
	active?: boolean;
	carrier?: string;
	line_type?: string;
	country?: string;
	region?: string;
	city?: string;
	timezone?: string;
	leaked?: boolean;
	spammer?: boolean;
	name?: string;
	do_not_call?: boolean;
};

export async function ipqsPhoneEnricher(
	e164: string,
	signal: AbortSignal
): Promise<EnrichmentResult> {
	const key = process.env.IPQS_KEY;
	if (!key) return { source: 'ipqs', reasons: [], skipped: true };
	if (!E164_RE.test(e164)) return { source: 'ipqs', reasons: [], skipped: true };
	if (ipqsCircuitOpen('phone')) return { source: 'ipqs', reasons: [], skipped: true };
	return cached(`ipqs-phone:${e164}`, 60 * 60 * 6, () => lookup(e164, key, signal));
}

async function lookup(e164: string, key: string, signal: AbortSignal): Promise<EnrichmentResult> {
	// IPQS phone path takes the digits without a leading +.
	const number = e164.replace(/^\+/, '');
	const url = `https://www.ipqualityscore.com/api/json/phone/${encodeURIComponent(key)}/${encodeURIComponent(number)}`;
	let res: Response;
	try {
		res = await safeFetch(url, { signal });
	} catch {
		return { source: 'ipqs', reasons: [], failed: true };
	}
	if (!res.ok) return { source: 'ipqs', reasons: [], failed: true };

	let data: IpqsPhoneResponse;
	try {
		data = (await res.json()) as IpqsPhoneResponse;
	} catch {
		return { source: 'ipqs', reasons: [], failed: true };
	}
	if (data.success === false) {
		ipqsNoteFailure('phone');
		return { source: 'ipqs', reasons: [], failed: true };
	}

	const reasons: Reason[] = [];

	if (data.spammer) {
		reasons.push({
			text: "IPQualityScore's abuse network has flagged this number as a known spammer source.",
			weight: 60,
			source: 'ipqs'
		});
	}
	if (data.recent_abuse) {
		reasons.push({
			text: 'IPQualityScore has linked this number to abusive activity recently.',
			weight: 50,
			source: 'ipqs'
		});
	}
	if (data.risky && !data.spammer && !data.recent_abuse) {
		reasons.push({
			text: 'IPQualityScore flags this number as risky based on past behaviour.',
			weight: 25,
			source: 'ipqs'
		});
	}
	if (data.leaked) {
		reasons.push({
			text: 'This number has appeared in a public data leak. Scammers often target leaked numbers.',
			weight: 10,
			source: 'ipqs'
		});
	}

	const fraud = data.fraud_score ?? 0;
	// Suppress the generic fraud-score reason when any specific flag fired,
	// otherwise the same signal is counted twice.
	const flaggedSpecific = data.spammer || data.recent_abuse || data.risky;
	if (!flaggedSpecific) {
		if (fraud >= 90) {
			reasons.push({
				text: `IPQualityScore rates this number as very high risk (${fraud}/100).`,
				weight: 50,
				source: 'ipqs'
			});
		} else if (fraud >= 75) {
			reasons.push({
				text: `IPQualityScore rates this number as high risk (${fraud}/100).`,
				weight: 30,
				source: 'ipqs'
			});
		} else if (fraud >= 50) {
			reasons.push({
				text: `IPQualityScore rates this number as moderate risk (${fraud}/100).`,
				weight: 15,
				source: 'ipqs'
			});
		}
	}

	// We don't restate validity here. libphonenumber has already parsed the
	// number into E.164 by the time we get here, so a valid: false response
	// from IPQS is more often an upstream artefact than a real signal.

	return {
		source: 'ipqs',
		reasons,
		meta: {
			fraud_score: data.fraud_score,
			recent_abuse: data.recent_abuse,
			spammer: data.spammer,
			risky: data.risky,
			line_type: data.line_type,
			carrier: data.carrier,
			VOIP: data.VOIP,
			prepaid: data.prepaid,
			country: data.country
		}
	};
}
