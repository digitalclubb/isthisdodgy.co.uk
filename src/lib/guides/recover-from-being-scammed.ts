import type { Guide } from './types.ts';

export const guide: Guide = {
	slug: 'recover-from-being-scammed',
	title: 'What to do after being scammed',
	h1: 'What to do after being scammed',
	description:
		'A calm UK step-by-step. The first hour, the first week, and the longer recovery. Including how to claim under the new APP fraud reimbursement rules.',
	lede: "Being scammed is awful. The most common reaction is shame, and shame stops people acting fast, which is exactly when speed matters most. Here's the order.",
	sections: [
		{
			id: 'first-hour',
			heading: 'The first hour',
			body: [
				{
					type: 'p',
					html: "If you've just sent money or shared bank details, this is the most useful hour of the whole recovery. Banks can sometimes recall a payment within minutes."
				},
				{
					type: 'ol',
					items: [
						'Call your bank using the number on the back of your card. Tell them what happened. They will freeze the card and try to recall the transfer.',
						'If you used a card, ask about chargeback (Visa, Mastercard) or Section 75 (credit card over £100). Both are real protections that work.',
						"Take screenshots of everything: the message, the website, the payment confirmation, the scammer's number or email.",
						"Don't click any more links from the scammer or block them yet. Their messages might be evidence."
					]
				},
				{
					type: 'callout',
					tone: 'warn',
					html: 'Don\'t pay anyone who calls offering to "recover" your stolen money. That is the second-stage scam. Real recovery only happens through your bank, your card provider and Action Fraud.'
				}
			]
		},
		{
			id: 'first-day',
			heading: 'The first day',
			body: [
				{
					type: 'ol',
					items: [
						'Report it to <strong>Action Fraud</strong> at <a href="https://www.actionfraud.police.uk" rel="external noopener noreferrer">actionfraud.police.uk</a> or call 0300 123 2040. In Scotland call 101. You\'ll get a crime reference number, keep it.',
						'Change passwords on any account you used the same password on. Email first, then banking, then everything else.',
						"Turn on two-factor authentication everywhere it's offered.",
						'Tell one person you trust. Going through this alone makes recovery slower and harder.'
					]
				}
			]
		},
		{
			id: 'first-week',
			heading: 'The first week',
			body: [
				{
					type: 'h3',
					text: 'Bank reimbursement under the new APP rules'
				},
				{
					type: 'p',
					html: 'Since 7 October 2024, UK banks must reimburse most "authorised push payment" fraud (where you were tricked into sending money). Limit is £85,000 per claim. The bank has 5 working days to respond. They might extend that to 35 days if they need more time, but they have to tell you.'
				},
				{
					type: 'p',
					html: 'You should get reimbursed unless the bank can prove you were "grossly negligent". Ignoring a clear bank warning during the payment is the main thing they\'ll point to. Reasonable mistakes are covered.'
				},
				{
					type: 'p',
					html: 'If your bank rejects the claim, escalate to the <a href="https://www.financial-ombudsman.org.uk" rel="external noopener noreferrer">Financial Ombudsman Service</a>. It\'s free.'
				},
				{
					type: 'h3',
					text: 'Watch for fallout'
				},
				{
					type: 'ul',
					items: [
						'Check your bank account daily for unusual transactions.',
						'Look at "sign-in activity" for your email account. Sign out everywhere if anything looks unfamiliar.',
						"Watch for password-reset emails you didn't start.",
						'Watch for new account-confirmation emails (a sign someone is signing you up to things, often as a smokescreen).'
					]
				}
			]
		},
		{
			id: 'identity-protection',
			heading: 'Identity protection',
			body: [
				{
					type: 'p',
					html: 'If the scammer got more than just a payment, they may try to take loans or open accounts in your name.'
				},
				{
					type: 'ul',
					items: [
						'Get <a href="https://www.cifas.org.uk/services/identity-protection/protective-registration" rel="external noopener noreferrer">Cifas Protective Registration</a>. A small fee, lasts two years. Lenders see a flag and do extra checks.',
						'Pull your credit report from all three UK agencies. <a href="https://www.checkmyfile.com" rel="external noopener noreferrer">CheckMyFile</a> shows all three with a free trial. Look for accounts you didn\'t open.',
						'Set up Direct Debit Indemnity alerts with your bank if they offer them.'
					]
				}
			]
		},
		{
			id: 'mental-recovery',
			heading: "It's not your fault",
			body: [
				{
					type: 'p',
					html: 'This part matters more than people give it credit for. Modern scams are professionally produced, often by international organised-crime groups. Falling for one says nothing about your intelligence. The shame and self-blame after is genuinely harder than the financial loss for many people.'
				},
				{
					type: 'p',
					html: 'Talk to someone. <a href="https://www.victimsupport.org.uk/help-and-support/get-help/support-near-you/types-of-crime/fraud-and-cyber-crime/" rel="external noopener noreferrer">Victim Support</a> has a dedicated fraud team. It\'s free, confidential and they\'re used to it.'
				},
				{
					type: 'callout',
					tone: 'note',
					html: "UK Finance reports over £1bn a year is stolen via scams in the UK. You are absolutely not alone in this. The scammers want you to feel isolated. Don't let them."
				}
			]
		},
		{
			id: 'longer-term',
			heading: 'Longer term',
			body: [
				{
					type: 'p',
					html: 'A scam tends to attract follow-up attempts. The same number, email or new "recovery" pitch will reach you. That\'s normal. Forward to 7726, ignore, move on.'
				},
				{
					type: 'p',
					html: "Once the dust settles, it's worth thinking about what made this scam land specifically. Tiredness, a stressful week, a half-real-looking page that caught you off-guard. That awareness is the protection going forward."
				}
			]
		}
	],
	faqs: [
		{
			q: "My bank says they won't refund me. Can I appeal?",
			a: 'Yes. Ask for the decision in writing. If you still disagree, complain in writing to the bank, then escalate to the Financial Ombudsman Service after eight weeks (or sooner if the bank issues a "final response"). The FOS is free and they reverse a meaningful proportion of bank decisions.'
		},
		{
			q: 'How long do banks have to refund me?',
			a: 'Under the APP reimbursement rules, banks must respond within 5 working days. They can extend this to 35 days if they need more investigation, but they must tell you in writing.'
		},
		{
			q: 'I sent money to a "recovery agent" who said they\'d get my stolen funds back. Now they\'ve disappeared too.',
			a: "You've been hit by the second-stage scam. It's very common. Report it to Action Fraud as a separate incident, with your original crime reference number. Your bank may still reimburse this if it qualifies under APP fraud rules."
		},
		{
			q: 'Will the police actually catch the scammer?',
			a: "Often they're overseas, so direct prosecution is rare. Reports still matter: they fund takedowns of scam infrastructure (websites, phone numbers, bank mules), which prevents future losses."
		}
	],
	relatedPatterns: ['bank-impersonation', 'romance-scam', 'crypto-investment'],
	relatedGuides: ['report-a-scam-uk', 'clicked-a-scam-link', 'protect-elderly-from-scams']
};
