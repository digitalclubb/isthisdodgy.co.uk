// UK consumer scam patterns. Each pattern bundles user-facing copy with
// keyword regexes. First match wins for the headline pattern.
export type ScamPattern = {
	slug: string;
	name: string;
	headline: string;
	summary: string;
	signals: RegExp[];
	advice: string[];
};

export const SCAM_PATTERNS: ScamPattern[] = [
	{
		slug: 'royal-mail-fee',
		name: 'Royal Mail / parcel fee scam',
		headline: 'Looks like a Royal Mail "fee" scam',
		summary:
			"Texts that claim you owe a small fee on a Royal Mail parcel are one of the most common scams in the UK. Royal Mail doesn't ask for fees by SMS link.",
		signals: [
			/royal\s*mail/i,
			/(parcel|package).{0,40}(fee|charge|customs|redeliver|reschedule)/i,
			/(small|outstanding|unpaid).{0,15}(fee|charge|shipping)/i
		],
		advice: [
			'Forward the text to 7726 (free). Royal Mail flags these.',
			'Never enter card details from a parcel-fee text.',
			'If in doubt, check your tracking directly on royalmail.com.'
		]
	},
	{
		slug: 'evri-dpd-redelivery',
		name: 'Evri / DPD redelivery scam',
		headline: 'Looks like an Evri or DPD redelivery scam',
		summary:
			"Fake delivery texts claim a parcel needs rescheduling and link to a card-capture page. The real couriers don't ask for redelivery fees by text.",
		signals: [
			/(evri|hermes|dpd|parcelforce|dhl)/i,
			/(redeliver|reschedul|missed.{0,10}delivery|address.{0,15}incorrect)/i
		],
		advice: [
			'Forward the text to 7726. Couriers actively monitor this.',
			'Track parcels through the courier app or website you already use.',
			"Don't tap unfamiliar short links like bit.ly, tinyurl, .top or .xyz."
		]
	},
	{
		slug: 'hi-mum-whatsapp',
		name: '"Hi Mum / Dad" WhatsApp scam',
		headline: 'Looks like the "Hi Mum" WhatsApp scam',
		summary:
			'Scammers pose as a child whose phone is broken and ask a parent to pay an urgent bill. Action Fraud has logged thousands of UK reports.',
		signals: [
			/hi\s+(mum|mom|dad)/i,
			/(new\s+number|lost.{0,10}phone|broke.{0,10}phone|dropped.{0,10}phone)/i,
			/(can('?| )?t\s+log\s+in|send.{0,15}(money|payment)|pay.{0,20}(bill|invoice))/i
		],
		advice: [
			'Call your family member on their old number to verify before you send anything.',
			'Agree a family code word for emergencies.',
			'Report it to Action Fraud at actionfraud.police.uk.'
		]
	},
	{
		slug: 'hmrc-tax-refund',
		name: 'HMRC tax refund scam',
		headline: 'Looks like an HMRC tax-refund scam',
		summary:
			'HMRC never tells you about a refund by text or email with a link. These messages route to a fake gov.uk-styled login page.',
		signals: [/hmrc/i, /(tax\s+refund|tax\s+rebate|owe.{0,15}tax|outstanding.{0,15}tax)/i],
		advice: [
			'Forward the message to 60599 (HMRC text-scam reporting) and 7726.',
			'Real HMRC contact happens via your gov.uk Personal Tax Account.',
			'Never enter card or bank details from an HMRC link.'
		]
	},
	{
		slug: 'bank-impersonation',
		name: 'Bank impersonation scam',
		headline: 'Looks like a bank-impersonation scam',
		summary:
			'Real banks never ask you to move money to a "safe account" or share full passwords or one-time codes by phone or text.',
		signals: [
			/(natwest|barclays|lloyds|halifax|santander|hsbc|monzo|starling|nationwide)/i,
			/(safe\s+account|verify.{0,15}(account|identity)|new.{0,10}device|suspicious.{0,15}(activity|login))/i
		],
		advice: [
			'Hang up and call your bank using the number on the back of your card.',
			'Never move money because someone on the phone told you to.',
			'Report it to your bank and to Action Fraud.'
		]
	},
	{
		slug: 'energy-rebate',
		name: 'Energy rebate / Winter Fuel scam',
		headline: 'Looks like an energy or Winter Fuel rebate scam',
		summary:
			'Texts and emails offering an energy rebate or Winter Fuel Payment "to claim" almost always link to a card-capture page. The real scheme pays automatically.',
		signals: [
			/(energy\s+rebate|winter\s+fuel|cost\s+of\s+living|£150\s+rebate|£\s?400\s+rebate|council\s+tax\s+rebate)/i,
			/(claim|apply|verify).{0,15}(now|today|here|link)/i
		],
		advice: [
			'Eligible payments arrive automatically. You never apply via text.',
			'Check the official scheme details on gov.uk.',
			'Forward the message to 7726.'
		]
	},
	{
		slug: 'crypto-investment',
		name: 'Crypto / investment scam',
		headline: 'Looks like a crypto or investment scam',
		summary:
			'High guaranteed returns, "exclusive" trading platforms and "account managers" who push you to deposit more are classic UK investment-scam patterns.',
		signals: [
			/(bitcoin|crypto|ethereum|trading\s+bot|forex)/i,
			/(guaranteed|risk[\s-]?free|double\s+your|huge\s+returns?|exclusive\s+(opportunity|access))/i
		],
		advice: [
			'Real investments never guarantee returns.',
			'Check the FCA Warning List at fca.org.uk before you send money.',
			'Stop talking to the "account manager" and report it to Action Fraud.'
		]
	},
	{
		slug: 'romance-scam',
		name: 'Romance scam',
		headline: 'Looks like a romance scam',
		summary:
			"Someone you've never met in person asks for money. Often after weeks of attentive messages and usually for a one-off emergency or travel.",
		signals: [
			/(love|miss|baby|honey|darling)/i,
			/(send.{0,15}money|western\s+union|moneygram|gift\s+cards?|i?tunes\s+cards?|steam\s+cards?)/i,
			/(stuck|emergency|hospital|customs|airport)/i
		],
		advice: [
			"Don't send money or cards to anyone you've only met online.",
			'Reverse-image search their profile pictures.',
			'Speak to a friend you trust. Romance scams thrive in isolation.'
		]
	},
	{
		slug: 'job-offer',
		name: 'Fake job-offer scam',
		headline: 'Looks like a fake job-offer scam',
		summary:
			'WhatsApp or SMS "easy work from home" offers paying daily for liking videos or rating products are almost always task-platform scams.',
		signals: [
			/(work\s+from\s+home|easy\s+job|earn.{0,5}£?\d+.{0,20}(daily|day|hour))/i,
			/(whatsapp|telegram).{0,30}(hr|recruiter|manager)/i,
			/(rate\s+products?|like\s+videos?|app\s+optimi[sz]ation)/i
		],
		advice: [
			"Real employers don't recruit on WhatsApp out of the blue.",
			"Don't deposit money to 'unlock' bigger tasks. That's the scam.",
			'Report it to Action Fraud and block the sender.'
		]
	},
	{
		slug: 'tv-licence',
		name: 'TV Licensing scam',
		headline: 'Looks like a TV Licensing scam',
		summary:
			'Emails or texts saying your TV Licence "couldn\'t be renewed" or "needs verifying" are a long-running phishing campaign.',
		signals: [/tv\s*licen[cs]/i, /(renew|expire|verify|update.{0,15}details|payment.{0,15}fail)/i],
		advice: [
			'Renewal happens automatically if you pay by direct debit.',
			'Log in directly via tvlicensing.co.uk, not from an email link.',
			'Forward suspicious emails to phishing@tvlicensing.co.uk.'
		]
	}
];

const URGENCY_RE =
	/(act\s+now|urgent|immediately|within\s+24\s*hours?|final\s+(notice|warning)|last\s+chance|account.{0,15}(suspend|lock|block))/i;
const MONEY_REQUEST_RE =
	/(send\s+(me\s+)?(money|cash|funds)|pay\s+(now|today|the\s+fee)|wire\s+transfer|gift\s+cards?)/i;
const SHORT_LINK_RE =
	/\b(bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly|is\.gd|buff\.ly|shorturl|cutt\.ly|rb\.gy|s\.id)\b/i;

export const GENERIC_SIGNALS = {
	urgency: URGENCY_RE,
	moneyRequest: MONEY_REQUEST_RE,
	shortLink: SHORT_LINK_RE
};
