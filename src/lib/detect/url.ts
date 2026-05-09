import { parse as parseHost } from 'tldts';
import { GENERIC_SIGNALS } from './data/scam-patterns.ts';
import { HIGH_RISK_TLDS } from './data/suspicious-tlds.ts';
import { UK_IMPERSONATED_BRANDS } from './data/uk-brands.ts';
import type { Reason } from './verdict.ts';

const IPV4_HOST_RE = /^\d{1,3}(\.\d{1,3}){3}$/;
const HEX_DECIMAL_RE = /^[a-z0-9-]{15,}$/;

export type ParsedUrl = {
	href: string;
	hostname: string;
	domain: string;
	tld: string;
	isPunycode: boolean;
	hasUserinfo: boolean;
	isIpHost: boolean;
};

export function parseUrl(input: string): ParsedUrl | null {
	let candidate = input.trim();
	if (!candidate) return null;
	if (!/^https?:\/\//i.test(candidate)) {
		candidate = `http://${candidate}`;
	}
	let url: URL;
	try {
		url = new URL(candidate);
	} catch {
		return null;
	}
	const hostname = url.hostname.toLowerCase();
	if (!hostname?.includes('.') && !IPV4_HOST_RE.test(hostname)) {
		return null;
	}
	const tldsParsed = parseHost(hostname);
	const isIp = !!tldsParsed.isIp || IPV4_HOST_RE.test(hostname);
	// Public-Suffix-List aware extraction. eTLD+1 (e.g. "bbc.co.uk") is what
	// matters for domain-age and brand-impersonation checks. Fall back to the
	// hostname when tldts can't classify it (rare ccTLDs, IP hosts).
	const domain = tldsParsed.domain ?? hostname;
	const tld = tldsParsed.publicSuffix ?? hostname.split('.').pop() ?? '';
	return {
		href: url.href,
		hostname,
		domain,
		tld,
		isPunycode: hostname.startsWith('xn--') || hostname.includes('.xn--'),
		hasUserinfo: !!(url.username || url.password),
		isIpHost: isIp
	};
}

export type UrlCheckResult = {
	reasons: Reason[];
	parsed: ParsedUrl | null;
	normalised: string;
	pattern?: string;
};

export function checkUrl(input: string): UrlCheckResult {
	const parsed = parseUrl(input);
	if (!parsed) {
		return {
			reasons: [
				{
					text: "We couldn't read that as a web address.",
					weight: 0,
					source: 'heuristic'
				}
			],
			parsed: null,
			normalised: input
		};
	}

	const reasons: Reason[] = [];
	const lowerHref = parsed.href.toLowerCase();

	if (parsed.isIpHost) {
		reasons.push({
			text: 'Uses a raw IP address instead of a normal website name. Almost no real site does this.',
			weight: 50,
			source: 'heuristic'
		});
	}

	if (parsed.hasUserinfo) {
		reasons.push({
			text: 'Hides text before the @ sign in the link. A known way to disguise a fake address.',
			weight: 60,
			source: 'heuristic'
		});
	}

	if (parsed.isPunycode) {
		reasons.push({
			text: 'Uses a "punycode" name (xn--) which can disguise lookalike letters from other alphabets.',
			weight: 40,
			source: 'heuristic'
		});
	}

	if (HIGH_RISK_TLDS.has(parsed.tld)) {
		reasons.push({
			text: `Ends in .${parsed.tld}, a domain ending often used by short-lived scam sites.`,
			weight: 25,
			source: 'heuristic'
		});
	}

	if (parsed.hostname.length > 40) {
		reasons.push({
			text: 'The website name is unusually long. Scammers do this to hide a fake address.',
			weight: 15,
			source: 'heuristic'
		});
	}

	const subdomainCount = parsed.hostname.split('.').length - 2;
	if (subdomainCount >= 3) {
		reasons.push({
			text: 'Has lots of dots in the address. A common trick to make a fake URL look real.',
			weight: 15,
			source: 'heuristic'
		});
	}

	if (HEX_DECIMAL_RE.test(parsed.domain.split('.')[0] ?? '')) {
		const domainBase = parsed.domain.split('.')[0] ?? '';
		const digitRatio = (domainBase.match(/\d/g) ?? []).length / domainBase.length;
		if (digitRatio > 0.4) {
			reasons.push({
				text: 'Domain is full of random-looking letters and numbers. Uncommon for a real business.',
				weight: 25,
				source: 'heuristic'
			});
		}
	}

	if (GENERIC_SIGNALS.shortLink.test(lowerHref)) {
		reasons.push({
			text: 'Uses a link shortener that hides where the link actually goes.',
			weight: 20,
			source: 'heuristic'
		});
	}

	const brandFlag = detectBrandImpersonation(parsed);
	if (brandFlag) {
		reasons.push({
			text: brandFlag.reason,
			weight: 55,
			source: 'heuristic'
		});
	}

	if (parsed.href.startsWith('http://')) {
		reasons.push({
			text: 'Uses an unsecured (http://) address. Most real sites use https.',
			weight: 10,
			source: 'heuristic'
		});
	}

	return {
		reasons,
		parsed,
		normalised: parsed.href,
		pattern: brandFlag?.brand
	};
}

function detectBrandImpersonation(parsed: ParsedUrl): { brand: string; reason: string } | null {
	const lowerHost = parsed.hostname;
	for (const [brand, legitDomains] of Object.entries(UK_IMPERSONATED_BRANDS)) {
		const brandKey = brand.replace(/\s+/g, '');
		if (!lowerHost.includes(brandKey)) continue;
		const onLegit = legitDomains.some(
			(legit) => lowerHost === legit || lowerHost.endsWith(`.${legit}`)
		);
		if (onLegit) return null;
		return {
			brand,
			reason: `Mentions "${brand}" in the address but isn't on the real ${brand} website (${legitDomains[0]}).`
		};
	}
	return null;
}
