import type { EnrichmentResult } from '../verdict.ts';
import { cached, safeFetch } from './runner.ts';

const VALID_EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i;

type EmailRepResponse = {
	email?: string;
	reputation?: 'high' | 'medium' | 'low' | 'none';
	suspicious?: boolean;
	references?: number;
	details?: {
		blacklisted?: boolean;
		malicious_activity?: boolean;
		malicious_activity_recent?: boolean;
		credentials_leaked?: boolean;
		credentials_leaked_recent?: boolean;
		data_breach?: boolean;
		first_seen?: string | 'never';
		last_seen?: string | 'never';
		domain_exists?: boolean;
		domain_reputation?: 'high' | 'medium' | 'low' | 'n/a';
		new_domain?: boolean;
		days_since_domain_creation?: number;
		suspicious_tld?: boolean;
		spam?: boolean;
		free_provider?: boolean;
		disposable?: boolean;
		deliverable?: boolean;
		accept_all?: boolean;
		valid_mx?: boolean;
		spoofable?: boolean;
		spf_strict?: boolean;
		dmarc_enforced?: boolean;
		profiles?: string[];
	};
};

export async function emailrepEnricher(
	email: string,
	signal: AbortSignal
): Promise<EnrichmentResult> {
	const clean = email.toLowerCase().trim();
	if (!VALID_EMAIL_RE.test(clean)) return { source: 'emailrep', reasons: [], skipped: true };
	return cached(`emailrep:${clean}`, 60 * 60 * 6, () => lookup(clean, signal));
}

async function lookup(email: string, signal: AbortSignal): Promise<EnrichmentResult> {
	const url = `https://emailrep.io/${encodeURIComponent(email)}`;
	const headers: Record<string, string> = {
		Accept: 'application/json',
		'User-Agent': 'isthisdodgy.co.uk (free consumer scam check)'
	};
	if (process.env.EMAILREP_KEY) headers.Key = process.env.EMAILREP_KEY;
	let res: Response;
	try {
		res = await safeFetch(url, { signal, headers });
	} catch {
		return { source: 'emailrep', reasons: [], failed: true };
	}
	if (res.status === 429) return { source: 'emailrep', reasons: [], failed: true };
	if (!res.ok) return { source: 'emailrep', reasons: [], failed: true };

	let data: EmailRepResponse;
	try {
		data = (await res.json()) as EmailRepResponse;
	} catch {
		return { source: 'emailrep', reasons: [], failed: true };
	}

	const reasons: EnrichmentResult['reasons'] = [];
	const details = data.details ?? {};

	if (details.malicious_activity_recent) {
		reasons.push({
			text: 'This address has been linked to malicious activity recently.',
			weight: 70,
			source: 'emailrep'
		});
	} else if (details.malicious_activity) {
		reasons.push({
			text: 'This address has been linked to malicious activity in the past.',
			weight: 30,
			source: 'emailrep'
		});
	}

	if (details.spam) {
		reasons.push({
			text: 'This address has been seen sending spam.',
			weight: 35,
			source: 'emailrep'
		});
	}

	if (details.credentials_leaked_recent) {
		reasons.push({
			text: 'The login credentials for this address have leaked recently. Change the password if it is yours.',
			weight: 0,
			source: 'emailrep'
		});
	}

	if (details.disposable) {
		reasons.push({
			text: 'A disposable or throwaway email address.',
			weight: 30,
			source: 'emailrep'
		});
	}

	if (details.new_domain && (details.days_since_domain_creation ?? 9999) < 60) {
		reasons.push({
			text: `The email domain is brand new (${details.days_since_domain_creation ?? '?'} days old). Brand-new email domains are very common in scams.`,
			weight: 30,
			source: 'emailrep'
		});
	}

	if (details.deliverable === false && details.valid_mx === false) {
		reasons.push({
			text: 'This address looks invalid. The mail server does not accept messages.',
			weight: 10,
			source: 'emailrep'
		});
	}

	if (data.suspicious && reasons.length === 0) {
		reasons.push({
			text: 'EmailRep marks this address as suspicious based on its history.',
			weight: 25,
			source: 'emailrep'
		});
	}

	if (
		data.reputation === 'high' &&
		!data.suspicious &&
		(data.references ?? 0) > 10 &&
		reasons.length === 0
	) {
		reasons.push({
			text: 'EmailRep finds a long, clean public record for this address.',
			weight: -10,
			source: 'emailrep'
		});
	}

	return {
		source: 'emailrep',
		reasons,
		meta: {
			reputation: data.reputation,
			suspicious: data.suspicious,
			references: data.references,
			disposable: details.disposable,
			malicious: details.malicious_activity,
			recent: details.malicious_activity_recent,
			profiles: details.profiles
		}
	};
}
