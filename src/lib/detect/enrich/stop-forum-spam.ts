import type { EnrichmentResult } from '../verdict.ts';
import { cached, safeFetch } from './runner.ts';

const ENDPOINT = 'https://api.stopforumspam.org/api';
const VALID_EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i;

type SfsResponse = {
	success?: number;
	email?: { appears?: number; frequency?: number; lastseen?: string };
};

export async function stopForumSpamEnricher(
	email: string,
	signal: AbortSignal
): Promise<EnrichmentResult> {
	const clean = email.toLowerCase().trim();
	if (!VALID_EMAIL_RE.test(clean)) return { source: 'stop-forum-spam', reasons: [], skipped: true };
	return cached(`sfs:${clean}`, 60 * 60 * 6, () => lookup(clean, signal));
}

async function lookup(email: string, signal: AbortSignal): Promise<EnrichmentResult> {
	const url = `${ENDPOINT}?json&email=${encodeURIComponent(email)}`;
	let res: Response;
	try {
		res = await safeFetch(url, { signal });
	} catch {
		return { source: 'stop-forum-spam', reasons: [], failed: true };
	}
	if (!res.ok) return { source: 'stop-forum-spam', reasons: [], failed: true };

	let data: SfsResponse;
	try {
		data = (await res.json()) as SfsResponse;
	} catch {
		return { source: 'stop-forum-spam', reasons: [], failed: true };
	}

	if (data.success !== 1 || !data.email) {
		return { source: 'stop-forum-spam', reasons: [], failed: true };
	}

	const appears = data.email.appears ?? 0;
	if (appears < 1) {
		return { source: 'stop-forum-spam', reasons: [], meta: { reports: 0 } };
	}

	const lastseen = data.email.lastseen ?? null;
	const reasonText = describe(appears, lastseen);
	return {
		source: 'stop-forum-spam',
		reasons: [
			{
				text: reasonText,
				weight: appears >= 3 ? 50 : 30,
				source: 'stop-forum-spam'
			}
		],
		meta: { reports: appears, lastseen }
	};
}

function describe(reports: number, lastseen: string | null): string {
	const noun = reports === 1 ? 'time' : 'times';
	if (lastseen) {
		const seenDate = new Date(lastseen);
		if (!Number.isNaN(seenDate.getTime())) {
			const days = Math.floor((Date.now() - seenDate.getTime()) / 86_400_000);
			if (days < 30) {
				return `Reported as a spam sender ${reports} ${noun}, last seen ${days} days ago.`;
			}
			if (days < 365) {
				return `Reported as a spam sender ${reports} ${noun}, last seen ${Math.floor(days / 30)} months ago.`;
			}
		}
	}
	return `Reported as a spam sender ${reports} ${noun} on the StopForumSpam database.`;
}
