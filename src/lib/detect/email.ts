import { DISPOSABLE_EMAIL_DOMAINS, FREE_EMAIL_PROVIDERS } from './data/disposable-emails.ts';
import { UK_IMPERSONATED_BRANDS } from './data/uk-brands.ts';
import { officialDomain, officialEmailDomainReason } from './data/uk-official.ts';
import type { Reason } from './verdict.ts';

const VALID_EMAIL_RE = /^[a-z0-9._%+-]+@([a-z0-9-]+(?:\.[a-z0-9-]+)+)$/i;

export type EmailCheckResult = {
	reasons: Reason[];
	domain: string | null;
	normalised: string;
};

export function checkEmail(input: string): EmailCheckResult {
	const value = input.trim().toLowerCase();
	const match = value.match(VALID_EMAIL_RE);
	if (!match) {
		return {
			reasons: [
				{
					text: "That doesn't look like a complete email address.",
					weight: 0,
					source: 'heuristic'
				}
			],
			domain: null,
			normalised: value
		};
	}

	const domain = (match[1] ?? '').toLowerCase();
	const reasons: Reason[] = [];

	if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
		reasons.push({
			text: 'A throwaway or temporary email service. Often used to hide identity.',
			weight: 65,
			source: 'heuristic'
		});
	}

	const localPart = value.split('@')[0] ?? '';
	const looksRandom = /[a-z]{4,}\d{3,}/.test(localPart) || localPart.length > 30;
	if (looksRandom) {
		reasons.push({
			text: 'The part before the @ looks auto-generated.',
			weight: 10,
			source: 'heuristic'
		});
	}

	const brandImpersonation = detectBrandFromEmail(value, domain);
	if (brandImpersonation) {
		reasons.push({
			text: brandImpersonation,
			weight: 60,
			source: 'heuristic'
		});
	}

	const official = officialDomain(domain);
	if (official) {
		reasons.push({
			text: officialEmailDomainReason(official),
			weight: -30,
			source: 'heuristic'
		});
	}

	if (reasons.length === 0) {
		const isFreeProvider = FREE_EMAIL_PROVIDERS.has(domain);
		reasons.push({
			text: isFreeProvider
				? `A normal ${domain} address. Fine for personal contact. Suspicious if a "business" claims to use it.`
				: "We didn't find obvious red flags in this email address.",
			weight: 0,
			source: 'heuristic'
		});
	}

	return { reasons, domain, normalised: value };
}

function detectBrandFromEmail(email: string, domain: string): string | null {
	const localPart = email.split('@')[0] ?? '';
	for (const [brand, legitDomains] of Object.entries(UK_IMPERSONATED_BRANDS)) {
		const brandKey = brand.replace(/\s+/g, '');
		if (!localPart.includes(brandKey) && !domain.includes(brandKey)) continue;
		const onLegit = legitDomains.some((legit) => domain === legit || domain.endsWith(`.${legit}`));
		if (onLegit) return null;
		return `Pretends to be from "${brand}" but the real address would end in @${legitDomains[0]}.`;
	}
	return null;
}
