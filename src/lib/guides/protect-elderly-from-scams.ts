import type { Guide } from './types.ts';

export const guide: Guide = {
	slug: 'protect-elderly-from-scams',
	title: 'How to help older relatives stay safe from scams',
	h1: 'How to help older relatives stay safe',
	description:
		'A practical UK guide to helping parents and grandparents avoid the most common scams. Settings, conversations and habits that genuinely help.',
	lede: "Older relatives are targeted disproportionately for scams that turn on trust and urgency. The most useful protection is rarely software. It's a few habits and a couple of phone settings.",
	sections: [
		{
			id: 'why-targeted',
			heading: 'Why older people get targeted',
			body: [
				{
					type: 'p',
					html: "Scammers don't go after older people because they're easily fooled. They go after them because:"
				},
				{
					type: 'ul',
					items: [
						'Older people are more likely to have savings.',
						'They are more likely to be home and pick up the phone during work hours.',
						'They are more likely to trust authority (a "police officer", "bank manager", "HMRC officer").',
						'They are more likely to be alone with the call when the pressure is applied.'
					]
				}
			]
		},
		{
			id: 'the-conversation',
			heading: 'Have the conversation properly',
			body: [
				{
					type: 'p',
					html: 'A one-off lecture rarely sticks. A shared, low-stakes chat does. Try one of these openers:'
				},
				{
					type: 'ul',
					items: [
						'"Have you had any of those weird Royal Mail texts? Apparently they\'re going round."',
						'"I read about a scam where the bank rings up. Have you heard about it?"',
						'"There\'s a website where you can paste a dodgy text and it tells you. We could try one."'
					]
				},
				{
					type: 'p',
					html: "The point is to make scams a normal topic, so when one arrives, your relative is comfortable forwarding it to you. Embarrassment is the scammer's ally."
				}
			]
		},
		{
			id: 'rules',
			heading: 'Three rules to agree on, in advance',
			body: [
				{
					type: 'ol',
					items: [
						'<strong>Never act on an unexpected call.</strong> "Your bank" calling out of the blue: hang up. Then ring the bank back on the number on the back of the card. Real banks support this exactly.',
						'<strong>Never give a one-time code by phone.</strong> Banks include this in every text they send. No real organisation will ever ask for it.',
						"<strong>Always pause if there's urgency.</strong> Real emergencies don't need a transfer in the next 10 minutes. Pressure is the tell."
					]
				}
			]
		},
		{
			id: 'phone-settings',
			heading: 'Useful phone settings',
			body: [
				{
					type: 'h3',
					text: 'iPhone'
				},
				{
					type: 'ul',
					items: [
						'<strong>Silence Unknown Callers</strong>: Settings, Phone, Silence Unknown Callers. Calls from numbers not in contacts go straight to voicemail. Real people leave messages.',
						'<strong>Filter unknown senders (Messages)</strong>: Settings, Messages, Unknown & Spam.',
						'<strong>Larger text and bold text</strong>: Settings, Display & Brightness. Easier to read sender details on a small screen.'
					]
				},
				{
					type: 'h3',
					text: 'Android'
				},
				{
					type: 'ul',
					items: [
						'<strong>Caller ID & Spam</strong> in the Phone app. Switches on automatic spam-call labelling.',
						'<strong>Block unknown numbers</strong> if your relative gets daily nuisance calls.',
						'<strong>Spam protection</strong> in the Messages app: Settings, Spam protection.'
					]
				}
			]
		},
		{
			id: 'tools-to-set-up',
			heading: "Set these up while you're visiting",
			body: [
				{
					type: 'ul',
					items: [
						'<strong>Add yourself as a trusted contact</strong> on their banking app. Most UK banks let you nominate a "trusted contact" who can be alerted to unusual activity.',
						'<strong>Bookmark this site</strong>: paste anything suspicious to get a calm second opinion.',
						'<strong>Save 7726</strong> as a contact called "Forward scam texts here".',
						"<strong>Save Action Fraud's number</strong> (0300 123 2040) as a contact.",
						"<strong>Show them their bank's in-app chat</strong>. Most banks now support live chat for fraud reporting, easier than a phone queue."
					]
				}
			]
		},
		{
			id: 'red-flags',
			heading: 'Red flags worth memorising',
			body: [
				{
					type: 'p',
					html: 'Phrases to treat as automatic warning signs, no matter how convincing the caller sounds:'
				},
				{
					type: 'ul',
					items: [
						'"I need to move your money to a safe account."',
						'"I\'m calling from your bank\'s fraud team."',
						'"There\'s a warrant out, you need to pay this fine right now."',
						'"You\'ve won, but we just need to verify your card."',
						'"Don\'t tell anyone, this investigation is confidential."'
					]
				},
				{
					type: 'callout',
					tone: 'warn',
					html: 'The "don\'t tell anyone" line is a giveaway. Real fraud investigators want you to talk to your family. Scammers don\'t.'
				}
			]
		},
		{
			id: 'after-something-happens',
			heading: 'If something has already happened',
			body: [
				{
					type: 'p',
					html: "Don't lead with anger. Shame keeps people quiet, and silence helps the scammer most. The first line should be: \"I'm really glad you told me. Let's sort it out.\""
				},
				{
					type: 'p',
					html: 'Then: bank, then Action Fraud, then a careful look at any other accounts they may have used. See our guide on <a href="/guides/recover-from-being-scammed">what to do after being scammed</a> for the full sequence.'
				}
			]
		}
	],
	faqs: [
		{
			q: "My parent doesn't want help with their phone settings. What now?",
			a: "Don't insist. The conversation is more useful than the setup. Make sure they know they can forward suspicious texts to 7726 for free, and that they can call you any time before doing anything financial. That's a real protection on its own."
		},
		{
			q: 'Are bank "trusted contact" features actually useful?',
			a: 'Yes. NatWest, Lloyds, Halifax, Barclays and Santander all support nominated contacts who get alerted to unusual transactions. It is a low-friction safety net.'
		},
		{
			q: "Should I take over my parent's online banking entirely?",
			a: 'Almost never. Loss of independence is its own harm, and shared logins create their own fraud risks. Better: agree on a "call me first if anything feels off" rule.'
		},
		{
			q: 'A scammer rang and pretended to be me. How is that possible?',
			a: 'Caller ID can be spoofed. The number on screen is not proof. Real family contact you back through the channels you already use, not from an unknown number with urgency.'
		}
	],
	relatedPatterns: ['bank-impersonation', 'hi-mum-whatsapp', 'romance-scam'],
	relatedGuides: ['why-scammers-use-urgency', 'spot-a-phishing-email', 'recover-from-being-scammed']
};
