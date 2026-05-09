import type { Guide } from './types.ts';

export const guide: Guide = {
	slug: 'whatsapp-scam-prevention',
	title: 'How to avoid WhatsApp scams (Hi Mum and others)',
	h1: 'How to avoid WhatsApp scams',
	description:
		'A UK guide to the most common WhatsApp scams. Hi Mum, hijacked group chats, fake job offers and the verification-code trick. With clear steps to stay safe.',
	lede: 'WhatsApp is the channel of choice for UK consumer scams in 2026. The good news: nearly all of them follow a small number of patterns. Knowing them is the protection.',
	sections: [
		{
			id: 'hi-mum',
			heading: 'The Hi Mum scam',
			body: [
				{
					type: 'p',
					html: 'A message from a number you don\'t recognise: "Hi Mum, I\'ve dropped my phone and I\'m using a new one. Can you help me with something urgent?" After a few exchanges, the ask comes: a transfer for a phone bill, a deposit, a "new number to set up". The variants target dads, daughters, sons and partners.'
				},
				{
					type: 'p',
					html: "Action Fraud has logged thousands of UK reports of this single pattern. It works because it bypasses the brain's scepticism, by triggering parental concern instead."
				},
				{
					type: 'callout',
					tone: 'warn',
					html: "The defence is one phone call. Ring the person on their old number. Even if their phone is genuinely broken, the voicemail will pick up and you'll know they're not the sender."
				},
				{
					type: 'p',
					html: 'Agree a family code word now, before you ever need it. A simple word that anyone in the family can ask in an emergency to prove identity.'
				}
			]
		},
		{
			id: 'verification-code',
			heading: 'The "send me my verification code" scam',
			body: [
				{
					type: 'p',
					html: "A friend messages: \"Hi, I accidentally sent a code to your number. Can you forward it back to me? I'll explain later.\" If you forward the code, the scammer has just used it to steal your friend's WhatsApp account. They're now you, messaging your contacts."
				},
				{
					type: 'p',
					html: "WhatsApp verification codes never come for someone else's account. If you receive a code you didn't request, it means someone is trying to take over your account. Never share it."
				}
			]
		},
		{
			id: 'group-chat-takeover',
			heading: 'Group chat takeover',
			body: [
				{
					type: 'p',
					html: 'A scammer takes over one member of a school WhatsApp, parents\' group, or community chat, then messages everyone individually claiming to be the chair, treasurer or organiser. They ask for a small payment for a leaving present, a venue deposit, or a "quick favour".'
				},
				{
					type: 'p',
					html: 'The signal: a request that arrives privately ("can we keep this between us?") rather than in the group chat itself. Real group business stays in the group.'
				}
			]
		},
		{
			id: 'fake-job-offer',
			heading: 'Fake job and "easy money" offers',
			body: [
				{
					type: 'p',
					html: 'Out-of-the-blue WhatsApp message from "HR" or a "recruiter" offering work-from-home work, often paid daily for liking videos, rating products or completing simple online tasks. After a few legitimate-looking small payments, you\'re asked to deposit money to "unlock" higher-paid tasks. That deposit is the scam.'
				},
				{
					type: 'p',
					html: 'Real employers do not recruit on WhatsApp. They use email, LinkedIn or a real recruitment platform. If a "recruiter" cannot give you a UK office address, a phone number that answers and a verifiable LinkedIn profile, walk away.'
				}
			]
		},
		{
			id: 'romance',
			heading: 'Romance and "investment" cross-pollination',
			body: [
				{
					type: 'p',
					html: "You match on a dating app. After a few weeks of warm conversation the chat moves to WhatsApp. Eventually the new partner mentions a profitable trading platform their cousin runs. They'll guide you through it, just deposit a small amount."
				},
				{
					type: 'p',
					html: 'This is "pig butchering": long-form romance scams that pivot to investment fraud. The platform is fake. Early withdrawals work, then suddenly there are "fees" or "tax" you must pay before they\'ll release the rest, and the rest never comes.'
				}
			]
		},
		{
			id: 'protections',
			heading: 'Settings that help',
			body: [
				{
					type: 'p',
					html: 'WhatsApp has a few protections. Turn them on:'
				},
				{
					type: 'ul',
					items: [
						'<strong>Two-step verification</strong>: Settings, Account, Two-step verification. Adds a PIN that someone needs to register your number on a new phone.',
						'<strong>Silence unknown callers</strong>: Settings, Privacy, Calls.',
						'<strong>Block + Report</strong> any sender that gives you a bad feeling. Long-press the message and tap Report.',
						'<strong>Check security codes</strong> for important contacts: tap their name, then Encryption, to confirm the chat is end-to-end with the same person.'
					]
				}
			]
		},
		{
			id: 'general-rules',
			heading: 'Three rules for any WhatsApp message',
			body: [
				{
					type: 'ol',
					items: [
						"Never send money to a number you don't already know, even if they say they're a relative.",
						'Never share verification codes, even if a friend asks for them.',
						"Never trust a private DM that splits off from a group chat. If it's real group business, it goes back in the group."
					]
				}
			]
		}
	],
	faqs: [
		{
			q: 'How do scammers get my WhatsApp number in the first place?',
			a: "Numbers leak from data breaches, public phone-number lists scraped from websites, and recycled SIMs. Once on a list, the number is sold and reused for years. There's no way to remove it; reporting and blocking is the only practical defence."
		},
		{
			q: 'Can WhatsApp messages give my phone a virus?',
			a: "A plain text message cannot. The risk is in attachments and links. If someone you don't know sends an APK, ZIP, or unknown link, don't open it. Genuine media from people you know is fine."
		},
		{
			q: "My friend's account messaged me asking for money. What now?",
			a: "Their account has almost certainly been hacked. Call them on their normal number to confirm, then warn them so they can recover the account (Settings, Account, Help). Don't reply with anything sensitive in the meantime."
		},
		{
			q: 'Should I report WhatsApp scams to Action Fraud or to WhatsApp?',
			a: "Both. Action Fraud captures the data for UK takedowns. WhatsApp's in-app Report button cuts the chat's lifetime on their platform. They serve different purposes."
		}
	],
	relatedPatterns: ['hi-mum-whatsapp', 'job-offer', 'romance-scam'],
	relatedGuides: [
		'protect-elderly-from-scams',
		'why-scammers-use-urgency',
		'scam-text-warning-signs'
	]
};
