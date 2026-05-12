// Known-legitimate UK organisations: their official phone numbers and web/email
// domains. A match here lets us give a calm, positive verdict ("this is the
// genuine ...") instead of a vague "we didn't spot anything wrong".
//
// KEEP THIS LIST CONSERVATIVE AND ACCURATE. A wrong entry is worse than a
// missing one. Before adding anything, verify it against the organisation's own
// published contact page. Phone numbers are stored in E.164 form (+44...).
// A domain entry matches that domain and any subdomain of it.
//
// Note on phone numbers: the number shown on a phone's screen can be faked, so a
// match here means "this is a number the organisation publishes", not "this call
// definitely came from them". The verdict copy makes that clear.

import { UK_IMPERSONATED_BRANDS } from './uk-brands.ts';

export type OfficialOrg = {
	// Short organisation name, used without a leading article ("HMRC", "GOV.UK",
	// "Royal Mail", "the NHS" stays as "NHS" here).
	org: string;
	// Noun phrase describing the thing, used as "This is {what}." etc.
	what: string;
};

// E.164 number -> organisation. Deliberately small; extend only with verified
// numbers from the organisation's official site.
export const OFFICIAL_PHONE_NUMBERS: Map<string, OfficialOrg> = new Map([
	['+443001232040', { org: 'Action Fraud', what: 'the Action Fraud reporting line' }],
	['+443002003300', { org: 'HMRC', what: 'an HMRC helpline' }],
	['+443457740740', { org: 'Royal Mail', what: 'the Royal Mail customer service line' }],
	['+448082231133', { org: 'Citizens Advice', what: 'the Citizens Advice consumer helpline' }]
]);

// Public-sector domains. These are organisation-controlled suffixes: anything
// under .gov.uk, .nhs.uk, .police.uk or .parliament.uk is the genuine body.
const PUBLIC_SECTOR_DOMAINS: ReadonlyArray<readonly [string, OfficialOrg]> = [
	['gov.uk', { org: 'GOV.UK', what: 'an official GOV.UK domain' }],
	['nhs.uk', { org: 'NHS', what: 'an official NHS domain' }],
	['police.uk', { org: 'UK police', what: 'an official UK police domain' }],
	['parliament.uk', { org: 'UK Parliament', what: 'the official UK Parliament domain' }]
];

const BRAND_ACRONYMS = new Set(['hmrc', 'dvla', 'tfl', 'dpd', 'dhl', 'hsbc', 'tv', 'paypal']);

function brandToOrg(brand: string): string {
	return brand
		.split(' ')
		.map((w) =>
			BRAND_ACRONYMS.has(w) ? w.toUpperCase() : (w[0]?.toUpperCase() ?? '') + w.slice(1)
		)
		.join(' ');
}

// Domain (or any subdomain of it) -> organisation. Built from the public-sector
// list plus the legitimate brand domains we already track for impersonation
// checks, so the two never drift apart.
export const OFFICIAL_DOMAINS: Map<string, OfficialOrg> = (() => {
	const map = new Map<string, OfficialOrg>();
	for (const [domain, info] of PUBLIC_SECTOR_DOMAINS) map.set(domain, info);
	for (const [brand, domains] of Object.entries(UK_IMPERSONATED_BRANDS)) {
		const org = brandToOrg(brand);
		for (const d of domains) {
			if (!map.has(d)) map.set(d, { org, what: `an official ${org} domain` });
		}
	}
	return map;
})();

export function officialPhone(e164: string): OfficialOrg | undefined {
	return OFFICIAL_PHONE_NUMBERS.get(e164);
}

// Returns the most specific match: "hmrc.gov.uk" wins over "gov.uk".
export function officialDomain(hostname: string): OfficialOrg | undefined {
	const host = hostname.toLowerCase();
	let best: OfficialOrg | undefined;
	let bestLen = -1;
	for (const [domain, info] of OFFICIAL_DOMAINS) {
		if ((host === domain || host.endsWith(`.${domain}`)) && domain.length > bestLen) {
			best = info;
			bestLen = domain.length;
		}
	}
	return best;
}

// Reason text for each surface. Kept here so the wording lives in one place.
export function officialPhoneReason(info: OfficialOrg): string {
	return `This is ${info.what}.`;
}

export function officialPhoneAdvice(info: OfficialOrg): string[] {
	return [
		`This number belongs to ${info.org}. Worth knowing: the number shown on your phone can be faked, so a call or text "from" it is not proof it really came from ${info.org}.`,
		`If you are not sure, hang up and get in touch using the number on their official website, a recent letter or the back of your card. Never use a number someone gives you in a message.`
	];
}

export function officialDomainReason(info: OfficialOrg): string {
	return `This is ${info.what}, so this page is genuinely from ${info.org}.`;
}

export function officialEmailDomainReason(info: OfficialOrg): string {
	return `This address is on ${info.what}, so it is a genuine ${info.org} sender.`;
}
