import type { EnrichmentResult } from '../verdict.ts';
import { cached, safeFetch } from './runner.ts';

const ENDPOINT = 'https://safebrowsing.googleapis.com/v4/threatMatches:find';

const THREAT_COPY: Record<string, string> = {
	MALWARE: 'Google Safe Browsing flags this as a malware site.',
	SOCIAL_ENGINEERING: 'Google Safe Browsing flags this as a phishing or social-engineering site.',
	UNWANTED_SOFTWARE: 'Google Safe Browsing flags this as unwanted-software distribution.',
	POTENTIALLY_HARMFUL_APPLICATION: 'Google Safe Browsing flags this as a harmful-app source.'
};

type SafeBrowsingResponse = {
	matches?: { threatType?: string }[];
};

export async function safeBrowsingEnricher(
	href: string,
	signal: AbortSignal
): Promise<EnrichmentResult> {
	const key = process.env.GOOGLE_SAFE_BROWSING_KEY;
	if (!key) return { source: 'safe-browsing', reasons: [], skipped: true };
	let parsed: URL;
	try {
		parsed = new URL(href);
	} catch {
		return { source: 'safe-browsing', reasons: [], skipped: true };
	}
	if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
		return { source: 'safe-browsing', reasons: [], skipped: true };
	}
	return cached(`gsb:${href}`, 60 * 60 * 6, () => lookup(href, key, signal));
}

async function lookup(url: string, key: string, signal: AbortSignal): Promise<EnrichmentResult> {
	let res: Response;
	try {
		res = await safeFetch(ENDPOINT, {
			method: 'POST',
			signal,
			headers: {
				'Content-Type': 'application/json',
				// Header-based auth keeps the API key out of request URLs that
				// might appear in proxy logs or error stacks.
				'X-Goog-Api-Key': key
			},
			body: JSON.stringify({
				client: { clientId: 'isthisdodgy', clientVersion: '1.0' },
				threatInfo: {
					threatTypes: [
						'MALWARE',
						'SOCIAL_ENGINEERING',
						'UNWANTED_SOFTWARE',
						'POTENTIALLY_HARMFUL_APPLICATION'
					],
					platformTypes: ['ANY_PLATFORM'],
					threatEntryTypes: ['URL'],
					threatEntries: [{ url }]
				}
			})
		});
	} catch {
		return { source: 'safe-browsing', reasons: [], failed: true };
	}
	if (!res.ok) return { source: 'safe-browsing', reasons: [], failed: true };

	let data: SafeBrowsingResponse;
	try {
		data = (await res.json()) as SafeBrowsingResponse;
	} catch {
		return { source: 'safe-browsing', reasons: [], failed: true };
	}

	const matches = data.matches ?? [];
	if (matches.length === 0) {
		return { source: 'safe-browsing', reasons: [], meta: { match: false } };
	}

	const types = new Set(matches.map((m) => m.threatType ?? 'UNKNOWN'));
	const reasons = Array.from(types).map((t) => ({
		text: THREAT_COPY[t] ?? 'Google Safe Browsing flags this address as a known threat.',
		weight: 80,
		source: 'safe-browsing' as const
	}));
	return { source: 'safe-browsing', reasons, meta: { match: true, types: Array.from(types) } };
}
