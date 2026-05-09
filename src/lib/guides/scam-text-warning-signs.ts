import type { Guide } from './types.ts';

export const guide: Guide = {
	slug: 'scam-text-warning-signs',
	title: 'Warning signs of a scam text message',
	h1: 'Warning signs of a scam text message',
	description:
		'Eight things that almost always mean a text is a scam. With UK examples and what to do next.',
	lede: "Scam texts cost UK consumers hundreds of millions every year. The same patterns repeat. Here's what to look for, with real-world UK examples.",
	sections: [
		{
			id: 'unexpected-fee',
			heading: 'It asks for a small unexpected fee',
			body: [
				{
					type: 'p',
					html: 'The most common UK scam text claims you owe a tiny amount, usually £1 to £3, on a parcel or tax bill. Royal Mail, Evri, DPD, HMRC. The amount is small on purpose. People pay £1.45 without thinking, but the real goal is your card details.'
				},
				{
					type: 'callout',
					tone: 'warn',
					html: 'Real couriers and HMRC do not ask for fees by text with a link. None of them. If a text says they do, it is a scam.'
				}
			]
		},
		{
			id: 'urgency',
			heading: 'It pushes urgency',
			body: [
				{
					type: 'p',
					html: 'Scam texts almost always include a deadline:'
				},
				{
					type: 'ul',
					items: [
						'"Your parcel will be returned in 24 hours"',
						'"Your account will be locked tonight"',
						'"Final reminder before legal action"',
						'"Action required immediately"'
					]
				},
				{
					type: 'p',
					html: 'The urgency is the scam. Real organisations write to you in calmer language, with multiple ways to respond.'
				}
			]
		},
		{
			id: 'unfamiliar-link',
			heading: "The link is on a domain you don't recognise",
			body: [
				{
					type: 'p',
					html: "Real Royal Mail links are on royalmail.com. Real HMRC links are on gov.uk. Real bank links are on the bank's own domain. Anything else is a scam, even if the rest of the text looks plausible."
				},
				{
					type: 'p',
					html: 'Watch for endings like .top, .xyz, .click, .live, .icu and .cyou. These are cheap to register and are favoured by scammers.'
				},
				{
					type: 'p',
					html: 'Watch for hyphenated names that mix the brand with words like "secure", "verify", "portal", "redelivery". Real brands rarely do that.'
				}
			]
		},
		{
			id: 'shortened-link',
			heading: 'The link is shortened',
			body: [
				{
					type: 'p',
					html: 'bit.ly, tinyurl, t.co, cutt.ly. Real businesses know better than to send shortened links by text, because shortened links are exactly how scammers hide where they actually go. If you see one in a text claiming to be from a big organisation, that alone is a strong scam signal.'
				}
			]
		},
		{
			id: 'asks-for-codes',
			heading: 'It asks you to share a code or password',
			body: [
				{
					type: 'p',
					html: 'No legitimate organisation, anywhere, ever asks you to share a one-time code, full password or PIN. Banks include this exact warning in the texts they send. If something asks for one of those, it is a scam.'
				}
			]
		},
		{
			id: 'unknown-sender',
			heading: 'The sender ID looks wrong',
			body: [
				{
					type: 'p',
					html: 'Some scam texts come from a long random number. Others come from spoofed sender IDs that look almost right. "RoyalMali" instead of "Royal Mail". "HMRevenue" instead of "HMRC". A quick squint should pick up the difference.'
				},
				{
					type: 'p',
					html: "Caller ID can be spoofed even when the sender looks correct. Don't trust the sender alone. The link in the message is what tells you the truth."
				}
			]
		},
		{
			id: 'too-good-to-be-true',
			heading: 'It promises something for nothing',
			body: [
				{
					type: 'p',
					html: 'Free TV Licence, energy rebate, Winter Fuel Payment, council tax refund, NHS compensation. Real schemes pay automatically, or via your gov.uk Personal Tax Account. They never ask you to "claim now" via a link in a text.'
				}
			]
		},
		{
			id: 'pretends-to-be-someone-you-know',
			heading: 'It pretends to be a family member',
			body: [
				{
					type: 'p',
					html: '"Hi Mum, I\'ve dropped my phone, this is my new number." Variations target dads, sons, daughters and partners. The asks usually come within a few messages: a transfer for an urgent bill or a new phone.'
				},
				{
					type: 'p',
					html: 'Always call the person on their old number to confirm before you send anything. Even if their phone is genuinely broken, you will hear the voicemail. We have a dedicated guide on <a href="/scams/hi-mum-whatsapp">the Hi Mum WhatsApp scam</a> with more on this pattern.'
				}
			]
		},
		{
			id: 'what-to-do',
			heading: 'What to do',
			body: [
				{
					type: 'ol',
					items: [
						"Don't tap the link.",
						'Forward the message to <strong>7726</strong> (free, spells SPAM).',
						'Delete it.',
						'If you\'re not sure, paste the text into the checker on our <a href="/">home page</a>. We\'ll tell you in plain English.'
					]
				}
			]
		}
	],
	faqs: [
		{
			q: 'How do I block a scam text number?',
			a: 'On iPhone, open the message, tap the number at the top, then tap "Info" and "Block this Caller". On Android, long-press the message and choose "Block number" from the menu. Blocking is per-number, so a determined scammer will use a new one.'
		},
		{
			q: 'Why am I getting so many scam texts all of a sudden?',
			a: "Your number is almost certainly on a list that's been sold to scammers. This usually traces back to a service you signed up for that suffered a data breach. There's little you can do to remove it from those lists, but reporting (7726) helps cut the volume over time."
		},
		{
			q: "Can scammers send messages from a real bank's sender ID?",
			a: "Sometimes, yes. Sender IDs can be spoofed. The bank's name in the chat thread is not proof. The link in the message is the real test."
		},
		{
			q: "I tapped the link but didn't enter anything. Is that a problem?",
			a: 'Usually not. Just visiting a page rarely causes harm on a modern phone. The risk starts when you enter details or download something. See <a href="/guides/clicked-a-scam-link">our guide on what to do if you clicked</a> for more.'
		}
	],
	relatedPatterns: ['royal-mail-fee', 'evri-dpd-redelivery', 'hmrc-tax-refund', 'hi-mum-whatsapp'],
	relatedGuides: ['spot-a-phishing-email', 'clicked-a-scam-link', 'why-scammers-use-urgency']
};
