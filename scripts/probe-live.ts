// Touches real public APIs. No keys required for the script itself, but the
// app's enrichers will fire whichever ones have a key set in .env.local.
import { detect } from '../src/lib/detect/index.ts';

// Anything passed on the command line replaces the default fixture set.
//   pnpm probe:live "+44 9011 234567" "support@hmrc-claim.co"
const cliInputs = process.argv.slice(2);

const DEFAULT_SAMPLES = [
	// Real safe URL: should land "safe", RDAP should report a long-running
	// domain, IPQS should rate it low risk, Safe Browsing clean.
	'https://www.bbc.co.uk/news',

	// Google's official Safe Browsing test URL: always matches as malware.
	// If safe-browsing=checked but no match shows, your key is misconfigured.
	'http://malware.testing.google.test/testing/malware/',

	// Google's phishing test URL.
	'https://testsafebrowsing.appspot.com/s/phishing.html',

	// Plausible scam URL: brand-impersonation, suspicious TLD, likely 0 RDAP.
	'https://royal-mail-redelivery.top/uk',

	// Disposable email + StopForumSpam reported sender (try IPQS too).
	'helpme@mailinator.com',

	// Normal Gmail: should land "safe" with a clean IPQS reputation.
	'someone@gmail.com',

	// UK premium-rate number: heuristic flags it; if IPQS_KEY is set the
	// IPQS phone enricher fires and adds carrier / fraud-score data.
	'+44 9011 234567'
];

const SAMPLES = cliInputs.length > 0 ? cliInputs : DEFAULT_SAMPLES;

for (const input of SAMPLES) {
	const t0 = Date.now();
	const v = await detect(input);
	const dt = Date.now() - t0;
	console.log(`\n[${v.level}] ${input}  (${dt}ms)`);
	console.log(`  headline: ${v.headline}`);
	if (v.sources.length) {
		console.log(`  sources: ${v.sources.map((s) => `${s.name}=${s.state}`).join(' ')}`);
	}
	for (const r of v.reasons) {
		const sign = r.weight > 0 ? `+${r.weight}` : `${r.weight}`;
		console.log(`  • [${r.source} ${sign}] ${r.text}`);
	}
}
