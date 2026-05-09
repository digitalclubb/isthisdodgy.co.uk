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

export const VERDICT_SUMMARY: Record<VerdictLevel, string> = {
	safe: "We didn't spot anything obviously dodgy. Stay alert if anything feels off.",
	caution: 'Some things look unusual. Take a moment before you act.',
	suspicious: "We've seen patterns like this used in scams. Be very careful.",
	dodgy: 'This matches well-known scam patterns. We recommend not engaging.'
};

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
	// Stable secondary sort by source name so ties produce deterministic UI.
	const sortedReasons = [...reasons]
		.sort((a, b) => b.weight - a.weight || a.source.localeCompare(b.source))
		.slice(0, 4);
	return {
		level,
		headline: VERDICT_LABEL[level],
		summary: VERDICT_SUMMARY[level],
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
