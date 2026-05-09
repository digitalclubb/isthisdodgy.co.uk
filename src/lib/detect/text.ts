import { GENERIC_SIGNALS, SCAM_PATTERNS } from './data/scam-patterns.ts';
import { checkUrl } from './url.ts';
import type { Reason } from './verdict.ts';

const URL_RE = /\b(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+|[a-z0-9-]{2,}\.[a-z]{2,}\/[^\s<>"']*)/gi;

export type TextCheckResult = {
	reasons: Reason[];
	headlineOverride?: string;
	advice?: string[];
	pattern?: string;
	urlsFound: string[];
};

export function checkText(input: string): TextCheckResult {
	const text = input.trim();
	const reasons: Reason[] = [];
	let pattern: string | undefined;
	let headlineOverride: string | undefined;
	const advice: string[] = [];

	for (const p of SCAM_PATTERNS) {
		const matches = p.signals.filter((re) => re.test(text)).length;
		if (matches >= 2 || (matches === 1 && p.signals.length === 1)) {
			reasons.push({
				text: p.summary,
				weight: 60,
				source: 'pattern'
			});
			pattern = p.slug;
			headlineOverride = p.headline;
			advice.push(...p.advice);
			break;
		}
	}

	if (GENERIC_SIGNALS.urgency.test(text)) {
		reasons.push({
			text: 'Pushes urgency ("act now", "within 24 hours"). A classic pressure tactic.',
			weight: 20,
			source: 'heuristic'
		});
	}
	if (GENERIC_SIGNALS.moneyRequest.test(text)) {
		reasons.push({
			text: 'Asks for money, gift cards or transfers. A strong scam signal.',
			weight: 30,
			source: 'heuristic'
		});
	}
	if (GENERIC_SIGNALS.shortLink.test(text)) {
		reasons.push({
			text: 'Contains a shortened link that hides where it goes.',
			weight: 20,
			source: 'heuristic'
		});
	}

	const urlMatches = text.match(URL_RE) ?? [];
	for (const u of urlMatches.slice(0, 2)) {
		const sub = checkUrl(u);
		const dodgyReasons = sub.reasons.filter((r) => r.weight >= 25);
		for (const r of dodgyReasons) {
			reasons.push({
				text: `Link in the message: ${r.text}`,
				weight: r.weight,
				source: 'heuristic'
			});
		}
	}

	if (reasons.length === 0) {
		reasons.push({
			text: "Nothing in the text matched our common scam patterns. That's not a guarantee.",
			weight: 0,
			source: 'heuristic'
		});
	}

	return {
		reasons,
		headlineOverride,
		advice: advice.length ? advice : undefined,
		pattern,
		urlsFound: urlMatches
	};
}
