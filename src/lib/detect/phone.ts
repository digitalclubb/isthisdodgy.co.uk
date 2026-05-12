import { type PhoneNumber, parsePhoneNumberFromString } from 'libphonenumber-js';
import { type OfficialOrg, officialPhone, officialPhoneReason } from './data/uk-official.ts';
import type { Reason } from './verdict.ts';

// All checks operate on the National Significant Number, i.e. the +44 prefix
// stripped, so the leading "0" trunk digit is also gone. UK Ofcom ranges:
//   '9'  → 09xx premium-rate
//   '87' → 087x service-rate (0870-0873)
//   '84' → 084x service-rate (0843-0845)
//   '70' → 070x personal numbers
// Note: regular UK mobile numbers start "7" but never "70" (they're 074x-079x
// with most allocations in 077x-079x), so '70' does not over-match mobiles.
// 0800 freephone has NSN starting "80" and is intentionally not flagged.
const UK_PREMIUM_E164_PREFIXES = ['9'];
const UK_SERVICE_E164_PREFIXES = ['87', '84'];
const UK_PERSONAL_E164_PREFIXES = ['70'];

export type PhoneInsight = {
	e164?: string;
	national?: string;
	country?: string;
	isUK: boolean;
	type?: ReturnType<PhoneNumber['getType']>;
};

export function inspectPhone(raw: string, defaultCountry: 'GB' = 'GB'): PhoneInsight {
	const parsed = parsePhoneNumberFromString(raw, defaultCountry);
	if (!parsed) return { isUK: false };
	const e164 = parsed.number;
	const isUK = parsed.country === 'GB' || e164.startsWith('+44');
	return {
		e164,
		national: parsed.formatNational(),
		country: parsed.country,
		isUK,
		type: parsed.getType()
	};
}

export type PhoneCheckResult = {
	reasons: Reason[];
	insight: PhoneInsight;
	normalised: string;
	// Set when the number matches a known official UK organisation line.
	official?: OfficialOrg;
};

export function checkPhone(input: string): PhoneCheckResult {
	const reasons: Reason[] = [];
	const trimmed = input.trim();
	const insight = inspectPhone(trimmed);

	if (!insight.e164) {
		return {
			reasons: [
				{
					text: "We couldn't read that as a valid phone number.",
					weight: 0,
					source: 'heuristic'
				}
			],
			insight,
			normalised: trimmed
		};
	}

	// Known official line: say so plainly and stop. The premium-rate and similar
	// checks below don't apply to these numbers, and the engine skips the IPQS
	// lookup (a heavily spoofed official number can pick up spurious reports).
	const official = officialPhone(insight.e164);
	if (official) {
		return {
			reasons: [{ text: officialPhoneReason(official), weight: -30, source: 'heuristic' }],
			insight,
			normalised: insight.e164,
			official
		};
	}

	if (insight.isUK) {
		const ukNsn = insight.e164.replace(/^\+44/, '');
		let prefixMatched = false;
		if (UK_PREMIUM_E164_PREFIXES.some((p) => ukNsn.startsWith(p))) {
			prefixMatched = true;
			reasons.push({
				text: 'A UK premium-rate number (09…). Calls or texts can cost a lot per minute.',
				weight: 50,
				source: 'heuristic'
			});
		} else if (UK_SERVICE_E164_PREFIXES.some((p) => ukNsn.startsWith(p))) {
			prefixMatched = true;
			reasons.push({
				text: 'A UK service-rate number (084… / 087…). Calls cost more than a normal call. Often used by real businesses but worth a second look.',
				weight: 20,
				source: 'heuristic'
			});
		} else if (UK_PERSONAL_E164_PREFIXES.some((p) => ukNsn.startsWith(p))) {
			prefixMatched = true;
			reasons.push({
				text: 'A UK 070 "personal number". Looks mobile but often costs as much as a premium call.',
				weight: 35,
				source: 'heuristic'
			});
		}
		if (insight.type === 'PREMIUM_RATE' && !prefixMatched) {
			reasons.push({
				text: 'Classified as a premium-rate line. Calls cost more than usual.',
				weight: 40,
				source: 'heuristic'
			});
		}
	} else {
		reasons.push({
			text: `An international number (${insight.country ?? 'unknown country'}). Be careful if it claims to be from a UK organisation.`,
			weight: 30,
			source: 'heuristic'
		});
	}

	if (insight.type === 'TOLL_FREE') {
		reasons.push({
			text: 'A free-to-call number. Common for real customer service but scammers also spoof these.',
			weight: 0,
			source: 'heuristic'
		});
	}

	if (reasons.length === 0) {
		reasons.push({
			text: insight.isUK
				? "A standard UK number. We can't say more without context."
				: "A standard international number. We can't say more without context.",
			weight: 0,
			source: 'heuristic'
		});
	}

	return { reasons, insight, normalised: insight.e164 };
}
