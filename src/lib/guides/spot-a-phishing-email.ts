import type { Guide } from './types.ts';

export const guide: Guide = {
	slug: 'spot-a-phishing-email',
	title: 'How to spot a phishing email',
	h1: 'How to spot a phishing email',
	description:
		'A plain-English UK guide to spotting phishing emails. Six things to check before you click. Plus what to do if you get one.',
	lede: 'Phishing emails are designed to look like the real thing. Once you know what to check, most of them give themselves away in seconds.',
	sections: [
		{
			id: 'check-the-sender',
			heading: 'Check the sender, not the display name',
			body: [
				{
					type: 'p',
					html: 'The "from" name in your inbox is just a label. Anyone can set it to "HMRC" or "Royal Mail". The address itself is harder to fake. Tap or hover on the sender to see the real email.'
				},
				{
					type: 'p',
					html: 'Real organisations email from their own domain. HMRC uses an address ending in <strong>@hmrc.gov.uk</strong>. Royal Mail uses <strong>@royalmail.com</strong>. If a "Royal Mail" email comes from <code>noreply@parcel-update.top</code> or <code>support@royalmail.fix-account.co</code>, it is not from Royal Mail.'
				},
				{
					type: 'callout',
					tone: 'note',
					html: 'Tip: copy the sender domain into our checker on the home page. It will tell you if the address looks dodgy.'
				}
			]
		},
		{
			id: 'urgency-and-threats',
			heading: 'Watch for urgency and threats',
			body: [
				{
					type: 'p',
					html: 'Phishing relies on panic. The classic phrases:'
				},
				{
					type: 'ul',
					items: [
						'"Your account will be suspended in 24 hours"',
						'"Final notice"',
						'"Action required immediately"',
						'"Your parcel will be returned"',
						'"Unusual activity detected"'
					]
				},
				{
					type: 'p',
					html: 'A real bank, courier or government department will not threaten you with same-day consequences over email. If your gut says "this is making me nervous", that is exactly the reaction the scammer paid for.'
				}
			]
		},
		{
			id: 'check-the-link',
			heading: 'Check the link before you click',
			body: [
				{
					type: 'p',
					html: 'On a desktop, hover over the link without clicking. The real address shows up in the bottom-left of your browser. On a phone, press and hold the link to preview it.'
				},
				{
					type: 'p',
					html: 'The trick scammers use most is making the visible text look right while the underlying address is wrong. <code>www.royalmail.com</code> as link text could point anywhere.'
				},
				{
					type: 'p',
					html: 'Lookalike domains are common. Watch for extra words, hyphens or unusual endings:'
				},
				{
					type: 'ul',
					items: [
						'royalmail-redelivery.top instead of royalmail.com',
						'hmrc-tax-portal.live instead of gov.uk',
						'natwest-secure-login.click instead of natwest.com'
					]
				}
			]
		},
		{
			id: 'generic-greetings',
			heading: 'Generic greetings and small mistakes',
			body: [
				{
					type: 'p',
					html: 'Real businesses know your name. "Dear Customer", "Dear Sir or Madam" or just "Hi" at the start of a supposedly personal message is a small but telling sign.'
				},
				{
					type: 'p',
					html: 'Spelling and grammar mistakes used to be the giveaway. With AI-written scams that signal is weaker, but odd phrasing, missing articles ("Please update bank account") and inconsistent fonts in the same email still show up.'
				}
			]
		},
		{
			id: 'unexpected-attachments',
			heading: 'Unexpected attachments are dangerous',
			body: [
				{
					type: 'p',
					html: 'Treat any unexpected attachment as a threat. Especially:'
				},
				{
					type: 'ul',
					items: [
						'Invoices you were not expecting',
						'Word documents asking you to enable macros',
						'PDFs with download buttons inside',
						'Zip files claiming to contain photos or shipping documents'
					]
				},
				{
					type: 'p',
					html: "If you need to verify an invoice, log into the supplier's account directly. Never open the attachment first."
				}
			]
		},
		{
			id: 'asks-for-card-or-codes',
			heading: 'It asks for card details or codes',
			body: [
				{
					type: 'p',
					html: 'Real banks, real couriers and real government departments never ask you to enter your full card details, password or one-time code through an email link. If a message asks for any of those, stop and verify by going to the official website yourself, typed by hand.'
				}
			]
		},
		{
			id: 'what-to-do',
			heading: 'What to do when you spot one',
			body: [
				{
					type: 'ol',
					items: [
						"Don't click any links or open attachments.",
						'Forward the email to <a href="mailto:report@phishing.gov.uk">report@phishing.gov.uk</a> (the National Cyber Security Centre).',
						'Mark it as phishing in your email app, then delete it.',
						'If the email pretends to be from a specific brand, forward it to their abuse address too. HMRC: phishing@hmrc.gov.uk. Royal Mail: reportascam@royalmail.com.'
					]
				},
				{
					type: 'p',
					html: 'If you already clicked, see our guide on <a href="/guides/clicked-a-scam-link">what to do if you clicked a scam link</a>.'
				}
			]
		}
	],
	faqs: [
		{
			q: 'Are phishing emails illegal in the UK?',
			a: 'Yes. Phishing is fraud under the Fraud Act 2006 and is investigated by Action Fraud. Reporting them helps takedowns happen faster.'
		},
		{
			q: 'What does "phishing" actually mean?',
			a: 'Phishing is when a scammer pretends to be a trusted organisation in an email or message to trick you into giving them money, login details or personal information.'
		},
		{
			q: 'I clicked a link in a phishing email. What now?',
			a: "Don't panic. If you didn't enter any details, you're probably fine. Run a virus scan to be safe. If you entered a password, change it immediately on every site that uses it. If you entered card or banking details, call your bank straight away."
		},
		{
			q: 'How do I report a phishing email in the UK?',
			a: 'Forward it to report@phishing.gov.uk. That goes to the National Cyber Security Centre, which gets the page taken down. For HMRC scams use phishing@hmrc.gov.uk. For Royal Mail use reportascam@royalmail.com.'
		}
	],
	relatedPatterns: ['hmrc-tax-refund', 'royal-mail-fee', 'bank-impersonation'],
	relatedGuides: ['clicked-a-scam-link', 'scam-text-warning-signs', 'why-scammers-use-urgency']
};
