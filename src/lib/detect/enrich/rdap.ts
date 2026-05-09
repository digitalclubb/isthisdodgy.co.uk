import type { EnrichmentResult } from '../verdict.ts';
import { cached, safeFetch } from './runner.ts';

const VALID_DOMAIN_RE = /^[a-z0-9][a-z0-9.-]{1,251}[a-z0-9]\.[a-z]{2,}$/i;

type RdapEvent = { eventAction?: string; eventDate?: string };
type RdapResponse = { events?: RdapEvent[] };

type CachedAge = { source: 'rdap'; reasons: []; meta: RdapMeta };
type RdapMeta = {
	found: boolean;
	registeredAt?: string;
};

export async function rdapEnricher(domain: string, signal: AbortSignal): Promise<EnrichmentResult> {
	const clean = domain.toLowerCase().trim();
	if (!VALID_DOMAIN_RE.test(clean)) {
		return { source: 'rdap', reasons: [], skipped: true };
	}
	const raw = await cached(`rdap:${clean}`, 60 * 60 * 24, () => fetchRaw(clean, signal));
	return decorate(raw);
}

async function fetchRaw(domain: string, signal: AbortSignal): Promise<CachedAge> {
	const url = `https://rdap.org/domain/${encodeURIComponent(domain)}`;
	let res: Response;
	try {
		res = await safeFetch(url, {
			signal,
			headers: { Accept: 'application/rdap+json' }
		});
	} catch {
		return { source: 'rdap', reasons: [], meta: { found: false } };
	}

	if (res.status === 404) {
		return { source: 'rdap', reasons: [], meta: { found: false } };
	}
	if (!res.ok) {
		return { source: 'rdap', reasons: [], meta: { found: true } };
	}

	let data: RdapResponse;
	try {
		data = (await res.json()) as RdapResponse;
	} catch {
		return { source: 'rdap', reasons: [], meta: { found: true } };
	}

	const registration = (data.events ?? []).find(
		(e) => e.eventAction === 'registration' && typeof e.eventDate === 'string'
	);
	if (!registration?.eventDate) {
		return { source: 'rdap', reasons: [], meta: { found: true } };
	}

	return {
		source: 'rdap',
		reasons: [],
		meta: { found: true, registeredAt: registration.eventDate }
	};
}

function decorate(raw: CachedAge): EnrichmentResult {
	const meta = raw.meta;
	if (!meta.found) {
		return {
			source: 'rdap',
			reasons: [
				{
					text: 'No registration record found for this domain. It may not exist or may be brand new.',
					weight: 35,
					source: 'rdap'
				}
			],
			meta
		};
	}
	if (!meta.registeredAt) {
		return { source: 'rdap', reasons: [], meta };
	}
	const created = new Date(meta.registeredAt);
	if (Number.isNaN(created.getTime())) {
		return { source: 'rdap', reasons: [], meta };
	}
	const ageDays = Math.floor((Date.now() - created.getTime()) / 86_400_000);
	const enriched = { ...meta, ageDays };

	if (ageDays < 30) {
		return {
			source: 'rdap',
			reasons: [
				{
					text: `The domain was registered ${ageDescriptor(ageDays)}. New domains are very common in scams.`,
					weight: 50,
					source: 'rdap'
				}
			],
			meta: enriched
		};
	}
	if (ageDays < 180) {
		return {
			source: 'rdap',
			reasons: [
				{
					text: `The domain was registered ${ageDescriptor(ageDays)}. Worth being careful with very young sites.`,
					weight: 25,
					source: 'rdap'
				}
			],
			meta: enriched
		};
	}
	if (ageDays >= 365 * 3) {
		return {
			source: 'rdap',
			reasons: [
				{
					text: `The domain has been registered for over ${Math.floor(ageDays / 365)} years. Long-running domains are usually legitimate.`,
					weight: -10,
					source: 'rdap'
				}
			],
			meta: enriched
		};
	}

	return {
		source: 'rdap',
		reasons: [
			{
				text: `The domain was registered ${ageDescriptor(ageDays)}.`,
				weight: 0,
				source: 'rdap'
			}
		],
		meta: enriched
	};
}

function ageDescriptor(days: number): string {
	if (days < 1) return 'today';
	if (days === 1) return 'yesterday';
	if (days < 30) return `${days} days ago`;
	if (days < 365) return `${Math.floor(days / 30)} months ago`;
	const years = Math.floor(days / 365);
	return years === 1 ? '1 year ago' : `${years} years ago`;
}
