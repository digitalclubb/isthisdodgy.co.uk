process.env.DISABLE_ENRICHERS = '1';

import { detect } from '../src/lib/detect/index.ts';

const SAMPLES: {
	label: string;
	input: string;
	expectMin: 'safe' | 'caution' | 'suspicious' | 'dodgy';
}[] = [
	{
		label: 'Royal Mail fee text',
		input:
			'Royal Mail: your parcel could not be delivered due to a £1.45 unpaid fee. Reschedule: https://royal-mail-redelivery.top/uk',
		expectMin: 'dodgy'
	},
	{
		label: 'Hi Mum WhatsApp',
		input: 'Hi Mum, dropped my phone, new number. Can you send £450 today?',
		expectMin: 'dodgy'
	},
	{
		label: 'HMRC refund text',
		input: 'HMRC: you are owed a tax refund of £284.10. Claim now: hmrc-uk.live/refund',
		expectMin: 'dodgy'
	},
	{
		label: 'Suspicious URL only',
		input: 'http://hmrc-refund-portal.xyz/login',
		expectMin: 'suspicious'
	},
	{ label: 'Punycode lookalike', input: 'https://xn--paypl-9wa.com/login', expectMin: 'caution' },
	{ label: 'IP host', input: 'http://93.184.216.34/login', expectMin: 'suspicious' },
	{ label: 'Real BBC URL', input: 'https://www.bbc.co.uk/news', expectMin: 'safe' },
	{ label: 'UK premium 09 number', input: '09011234567', expectMin: 'suspicious' },
	{ label: 'UK 070 number', input: '0700 900123', expectMin: 'suspicious' },
	{ label: 'UK 0844 service-rate', input: '0844 123 4567', expectMin: 'caution' },
	{ label: 'Standard UK mobile (TADL)', input: '+44 7911 123456', expectMin: 'safe' },
	{ label: 'Disposable email', input: 'helpme@mailinator.com', expectMin: 'dodgy' },
	{ label: 'Brand-impersonating email', input: 'support@hmrc-claim.co', expectMin: 'dodgy' },
	{ label: 'Normal Gmail', input: 'someone@gmail.com', expectMin: 'safe' },
	{
		label: 'Friendly text',
		input: 'Hey, are you free for a coffee Saturday afternoon?',
		expectMin: 'safe'
	}
];

const RANK = { safe: 0, caution: 1, suspicious: 2, dodgy: 3 } as const;
let failures = 0;

for (const s of SAMPLES) {
	const v = await detect(s.input);
	const ok = RANK[v.level] >= RANK[s.expectMin];
	const marker = ok ? '✓' : '✗';
	console.log(`${marker} [${v.level.padEnd(10)}] ${s.label}`);
	if (!ok) {
		failures++;
		console.log(`    expected at least ${s.expectMin}, got ${v.level}`);
		console.log(`    headline: ${v.headline}`);
		console.log(`    reasons: ${v.reasons.map((r) => `${r.weight}:${r.text}`).join(' | ')}`);
	}
}

if (failures > 0) {
	console.error(`\n${failures} smoke check(s) failed.`);
	process.exit(1);
}
console.log('\nAll smoke checks passed.');
