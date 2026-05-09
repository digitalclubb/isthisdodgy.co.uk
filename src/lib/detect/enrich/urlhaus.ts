import type { EnrichmentResult } from '../verdict.ts';
import { cached, safeFetch } from './runner.ts';

const ENDPOINT = 'https://urlhaus-api.abuse.ch/v1/url/';

type UrlHausResponse = {
	query_status?: string;
	threat?: string;
	url_status?: string;
	tags?: string[];
	date_added?: string;
};

export async function urlhausEnricher(
	href: string,
	signal: AbortSignal
): Promise<EnrichmentResult> {
	const authKey = process.env.URLHAUS_AUTH_KEY;
	if (!authKey) return { source: 'urlhaus', reasons: [], skipped: true };
	if (!/^https?:\/\//i.test(href)) return { source: 'urlhaus', reasons: [], skipped: true };
	return cached(`urlhaus:${href}`, 60 * 60 * 6, () => lookup(href, authKey, signal));
}

async function lookup(
	href: string,
	authKey: string,
	signal: AbortSignal
): Promise<EnrichmentResult> {
	const body = new URLSearchParams({ url: href });
	let res: Response;
	try {
		res = await safeFetch(ENDPOINT, {
			method: 'POST',
			signal,
			headers: {
				'Auth-Key': authKey,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body
		});
	} catch {
		return { source: 'urlhaus', reasons: [], failed: true };
	}
	if (!res.ok) return { source: 'urlhaus', reasons: [], failed: true };

	let data: UrlHausResponse;
	try {
		data = (await res.json()) as UrlHausResponse;
	} catch {
		return { source: 'urlhaus', reasons: [], failed: true };
	}

	if (data.query_status !== 'ok') {
		return { source: 'urlhaus', reasons: [], meta: { match: false } };
	}

	const reasonText = describe(data);
	return {
		source: 'urlhaus',
		reasons: [{ text: reasonText, weight: 80, source: 'urlhaus' }],
		meta: {
			match: true,
			threat: data.threat,
			urlStatus: data.url_status,
			tags: data.tags ?? []
		}
	};
}

function describe(data: UrlHausResponse): string {
	const threat = (data.threat ?? '').replace(/_/g, ' ').toLowerCase() || 'malicious activity';
	const status = data.url_status === 'online' ? 'currently active' : 'has been seen recently';
	return `URLhaus has logged this address for ${threat}. The link ${status}.`;
}
