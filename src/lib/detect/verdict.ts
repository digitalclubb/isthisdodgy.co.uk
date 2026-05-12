export type VerdictLevel = 'safe' | 'caution' | 'suspicious' | 'dodgy';

export type InputType = 'url' | 'phone' | 'email' | 'text' | 'unknown';

export type ReasonSource =
	| 'heuristic'
	| 'rdap'
	| 'dns'
	| 'safe-browsing'
	| 'urlhaus'
	| 'openphish'
	| 'emailrep'
	| 'stop-forum-spam'
	| 'ipqs'
	| 'pattern';

export type Reason = {
	text: string;
	weight: number;
	source: ReasonSource;
};

export type EnrichmentResult = {
	source: ReasonSource;
	reasons: Reason[];
	meta?: Record<string, unknown>;
	failed?: boolean;
	skipped?: boolean;
};

export type SourceState = 'checked' | 'disabled' | 'error';

export type Verdict = {
	level: VerdictLevel;
	headline: string;
	summary: string;
	reasons: Reason[];
	inputType: InputType;
	normalised?: string;
	advice: string[];
	pattern?: string;
	sources: { name: ReasonSource; state: SourceState }[];
	meta?: Record<string, unknown>;
};

export const VERDICT_LABEL: Record<VerdictLevel, string> = {
	safe: 'Probably safe',
	caution: 'Be careful',
	suspicious: 'Looks suspicious',
	dodgy: 'Likely dodgy'
};

// Default summaries, used when the verdict comes from weighted signals rather
// than an exact named scam pattern. Kept deliberately measured.
export const VERDICT_SUMMARY: Record<VerdictLevel, string> = {
	safe: "We didn't spot anything obviously dodgy. Stay alert if anything feels off.",
	caution: 'A few things here look a bit off. Take a moment before you act.',
	suspicious: 'Several things here look like the tricks scammers use. Be careful.',
	dodgy: "This has several warning signs we see in scams. We wouldn't engage with it."
};

// Stronger wording, used only when we matched a known, named scam pattern and
// can say so honestly.
const VERDICT_SUMMARY_PATTERN: Partial<Record<VerdictLevel, string>> = {
	suspicious: 'This looks a lot like a known scam pattern. Be careful.',
	dodgy: "This matches a known scam pattern. We wouldn't engage with it."
};

function summaryFor(level: VerdictLevel, hasPattern: boolean): string {
	if (hasPattern) {
		const patterned = VERDICT_SUMMARY_PATTERN[level];
		if (patterned) return patterned;
	}
	return VERDICT_SUMMARY[level];
}

export function levelFromScore(score: number): VerdictLevel {
	if (score >= 60) return 'dodgy';
	if (score >= 30) return 'suspicious';
	if (score >= 10) return 'caution';
	return 'safe';
}

export type BuildVerdictOptions = {
	normalised?: string;
	advice?: string[];
	pattern?: string;
	forcedLevel?: VerdictLevel;
	sources?: { name: ReasonSource; state: SourceState }[];
	meta?: Record<string, unknown>;
};

export function buildVerdict(
	inputType: InputType,
	reasons: Reason[],
	options: BuildVerdictOptions = {}
): Verdict {
	const score = reasons.reduce((acc, r) => acc + r.weight, 0);
	const level = options.forcedLevel ?? levelFromScore(score);
	// On a risky verdict, lead with the most alarming reason. On a safe verdict,
	// lead with the most reassuring one (the biggest negative weight). Stable
	// secondary sort by source name so ties produce deterministic UI.
	const dir = level === 'safe' ? 1 : -1;
	const sortedReasons = [...reasons]
		.sort((a, b) => dir * (a.weight - b.weight) || a.source.localeCompare(b.source))
		.slice(0, 4);
	return {
		level,
		headline: VERDICT_LABEL[level],
		summary: summaryFor(level, Boolean(options.pattern)),
		reasons: sortedReasons,
		inputType,
		normalised: options.normalised,
		advice: options.advice ?? defaultAdvice(level, inputType),
		pattern: options.pattern,
		sources: options.sources ?? [],
		meta: options.meta
	};
}

function defaultAdvice(level: VerdictLevel, type: InputType): string[] {
	const tips: string[] = [];
	if (level === 'safe') {
		tips.push("If anything still feels off, trust your gut. You don't have to engage.");
		return tips;
	}
	if (type === 'text' || type === 'phone') {
		tips.push('Forward suspicious texts to 7726 (free). It spells SPAM.');
	}
	tips.push('Never share passwords, codes or card details after an unexpected message.');
	if (level === 'dodgy' || level === 'suspicious') {
		tips.push('Report it to Action Fraud at actionfraud.police.uk or call 0300 123 2040.');
	}
	return tips;
}
