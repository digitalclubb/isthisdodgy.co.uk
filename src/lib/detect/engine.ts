import { classifyInput } from './classify.ts';
import { officialPhoneAdvice } from './data/uk-official.ts';
import { checkEmail } from './email.ts';
import { dnsEnricher } from './enrich/dns.ts';
import { emailrepEnricher } from './enrich/emailrep.ts';
import { ipqsEmailEnricher } from './enrich/ipqs-email.ts';
import { ipqsPhoneEnricher } from './enrich/ipqs-phone.ts';
import { ipqsUrlEnricher } from './enrich/ipqs-url.ts';
import { openphishEnricher } from './enrich/openphish.ts';
import { rdapEnricher } from './enrich/rdap.ts';
import { type EnricherSpec, runEnrichers } from './enrich/runner.ts';
import { safeBrowsingEnricher } from './enrich/safe-browsing.ts';
import { stopForumSpamEnricher } from './enrich/stop-forum-spam.ts';
import { urlhausEnricher } from './enrich/urlhaus.ts';
import { checkPhone } from './phone.ts';
import { checkText } from './text.ts';
import { checkUrl } from './url.ts';
import {
	buildVerdict,
	type Reason,
	type ReasonSource,
	type SourceState,
	type Verdict
} from './verdict.ts';

// Set DISABLE_ENRICHERS=1 to skip all network enrichers. Used by the smoke
// test and any environment where outbound network is unavailable. The
// heuristic layer still runs so verdicts remain correct, just less informed.
const ENRICHERS_DISABLED = process.env.DISABLE_ENRICHERS === '1';

export async function detect(input: string): Promise<Verdict> {
	const { type, value } = classifyInput(input);

	switch (type) {
		case 'url':
			return runUrl(value);
		case 'email':
			return runEmail(value);
		case 'phone':
			return runPhone(value);
		case 'text':
			return runText(value);
		default:
			return buildVerdict(
				'unknown',
				[
					{
						text: 'Paste a link, email, phone number or message to check it.',
						weight: 0,
						source: 'heuristic'
					}
				],
				{ forcedLevel: 'safe' }
			);
	}
}

async function runUrl(value: string): Promise<Verdict> {
	const heuristic = checkUrl(value);
	if (!heuristic.parsed) {
		return buildVerdict('url', heuristic.reasons, {
			forcedLevel: 'caution',
			normalised: heuristic.normalised
		});
	}

	const parsed = heuristic.parsed;
	const specs: EnricherSpec[] = ENRICHERS_DISABLED
		? []
		: [
				{ name: 'rdap', timeoutMs: 2500, run: (s) => rdapEnricher(parsed.domain, s) },
				{ name: 'dns', timeoutMs: 1500, run: (s) => dnsEnricher(parsed.hostname, s) },
				{
					name: 'safe-browsing',
					timeoutMs: 2500,
					run: (s) => safeBrowsingEnricher(parsed.href, s)
				},
				{ name: 'urlhaus', timeoutMs: 2500, run: (s) => urlhausEnricher(parsed.href, s) },
				{
					name: 'openphish',
					timeoutMs: 6000,
					run: (s) => openphishEnricher(parsed.href, parsed.hostname, s)
				},
				{ name: 'ipqs', timeoutMs: 3500, run: (s) => ipqsUrlEnricher(parsed.href, s) }
			];
	const results = await runEnrichers(specs);

	const reasons: Reason[] = [...heuristic.reasons];
	const meta: Record<string, unknown> = {};
	for (const r of results) {
		reasons.push(...r.reasons);
		if (r.meta) Object.assign(meta, { [r.source]: r.meta });
	}

	return buildVerdict('url', reasons, {
		normalised: heuristic.normalised,
		pattern: heuristic.pattern,
		sources: sourceList(['rdap', 'dns', 'safe-browsing', 'urlhaus', 'openphish', 'ipqs'], results),
		meta
	});
}

async function runEmail(value: string): Promise<Verdict> {
	const heuristic = checkEmail(value);
	if (!heuristic.domain) {
		return buildVerdict('email', heuristic.reasons, {
			forcedLevel: 'caution',
			normalised: heuristic.normalised
		});
	}

	// On a known official domain the domain itself settles it: a scammer can't
	// send from @gov.uk, so per-address reputation lookups add only noise (a
	// non-existent mailbox on a real domain can score "high risk").
	const specs: EnricherSpec[] =
		ENRICHERS_DISABLED || heuristic.official
			? []
			: [
					{
						name: 'emailrep',
						timeoutMs: 2500,
						run: (s) => emailrepEnricher(heuristic.normalised, s)
					},
					{
						name: 'stop-forum-spam',
						timeoutMs: 2000,
						run: (s) => stopForumSpamEnricher(heuristic.normalised, s)
					},
					{ name: 'ipqs', timeoutMs: 3500, run: (s) => ipqsEmailEnricher(heuristic.normalised, s) }
				];
	const results = await runEnrichers(specs);

	const reasons: Reason[] = [...heuristic.reasons];
	const meta: Record<string, unknown> = {};
	for (const r of results) {
		reasons.push(...r.reasons);
		if (r.meta) Object.assign(meta, { [r.source]: r.meta });
	}

	return buildVerdict('email', reasons, {
		normalised: heuristic.normalised,
		// Only list a source if we actually attempted it.
		sources: specs.length > 0 ? sourceList(['emailrep', 'stop-forum-spam', 'ipqs'], results) : [],
		meta
	});
}

async function runPhone(value: string): Promise<Verdict> {
	const heuristic = checkPhone(value);
	// Skip the IPQS lookup for a recognised official line: it adds no value and a
	// heavily spoofed official number can collect spurious abuse reports.
	const specs: EnricherSpec[] =
		ENRICHERS_DISABLED || heuristic.official || !heuristic.normalised.startsWith('+')
			? []
			: [
					{
						name: 'ipqs',
						timeoutMs: 3500,
						run: (s) => ipqsPhoneEnricher(heuristic.normalised, s)
					}
				];
	const results = await runEnrichers(specs);

	const reasons: Reason[] = [...heuristic.reasons];
	const meta: Record<string, unknown> = {};
	for (const r of results) {
		reasons.push(...r.reasons);
		if (r.meta) Object.assign(meta, { [r.source]: r.meta });
	}

	return buildVerdict('phone', reasons, {
		normalised: heuristic.normalised,
		advice: heuristic.official ? officialPhoneAdvice(heuristic.official) : undefined,
		// Only list a source if we actually attempted it.
		sources: specs.length > 0 ? sourceList(['ipqs'], results) : [],
		meta
	});
}

async function runText(value: string): Promise<Verdict> {
	const heuristic = checkText(value);
	const verdict = buildVerdict('text', heuristic.reasons, {
		pattern: heuristic.pattern,
		advice: heuristic.advice
	});
	if (heuristic.headlineOverride) verdict.headline = heuristic.headlineOverride;
	return verdict;
}

function sourceList(
	names: ReasonSource[],
	results: { source: ReasonSource; failed?: boolean; skipped?: boolean }[]
): { name: ReasonSource; state: SourceState }[] {
	return names.map((name) => {
		const r = results.find((x) => x.source === name);
		let state: SourceState = 'error';
		if (r && !r.failed && !r.skipped) state = 'checked';
		else if (r?.skipped) state = 'disabled';
		return { name, state };
	});
}
