import type { Guide } from './types.ts';

export const guide: Guide = {
	slug: 'avoid-investment-scams',
	title: 'How to avoid investment and crypto scams',
	h1: 'How to avoid investment and crypto scams',
	description:
		'A UK guide to spotting fake investment platforms, social-media trading "mentors" and pig-butchering scams. Plus how to check if a firm is real before you commit a penny.',
	lede: 'Investment fraud is the most lucrative single category of UK scam. The patterns are recognisable, and a 30-second check on the FCA register stops most of them dead.',
	sections: [
		{
			id: 'why-its-different',
			heading: 'Why investment scams are different',
			body: [
				{
					type: 'p',
					html: 'A parcel-fee scam takes £1.45. An investment scam takes life savings. Investment fraud has the highest average loss per case of any UK scam category, often in the thousands of pounds.'
				},
				{
					type: 'p',
					html: 'They land more rarely than parcel scams, but the loss when they do is brutal. And reimbursement is harder, because banks classify some investment fraud as "voluntary" rather than authorised-push-payment fraud.'
				}
			]
		},
		{
			id: 'common-patterns',
			heading: 'Five common UK patterns in 2026',
			body: [
				{
					type: 'h3',
					text: '1. The platform with too-good returns'
				},
				{
					type: 'p',
					html: 'A site, app or referral promises "guaranteed" returns of 8 to 30 per cent a month. Real investment products in the UK don\'t guarantee returns at all. The word "guaranteed" alongside an investment is itself the scam signal.'
				},
				{
					type: 'h3',
					text: '2. The personal "account manager"'
				},
				{
					type: 'p',
					html: "You deposit a small amount and someone calls or messages to \"help you grow it\". They're patient, professional and often very charming. They're also reading from a script. Real regulated platforms don't assign personal account managers to retail customers."
				},
				{
					type: 'h3',
					text: '3. The celebrity-endorsement ad'
				},
				{
					type: 'p',
					html: 'Martin Lewis, Elon Musk, Jeremy Clarkson, Rishi Sunak, all have had their faces deepfaked into "this changed my life" investment ads on Facebook, Instagram and TikTok. Martin Lewis publicly does no investment endorsements at all. The fake adverts use his face anyway.'
				},
				{
					type: 'h3',
					text: '4. Pig butchering'
				},
				{
					type: 'p',
					html: 'Long-form romance scams, often via dating apps or Tinder swipes that move to WhatsApp. Weeks of warm conversation. Then a casual mention of a profitable trading platform their cousin or uncle operates. The platform is fake. Withdrawals work for a while, then sudden "fees" or "tax" must be paid before anything more comes out.'
				},
				{
					type: 'h3',
					text: '5. The recovery scam'
				},
				{
					type: 'p',
					html: 'After you\'ve been scammed, a "recovery firm" contacts you offering to retrieve your stolen money for an upfront fee. They\'re the same people, or sold your details to others. Real fund recovery only happens through your bank, your card provider or Action Fraud, never via a cold call.'
				}
			]
		},
		{
			id: 'check-fca',
			heading: 'Check the FCA register first',
			body: [
				{
					type: 'p',
					html: 'The single most useful 30 seconds of any investment decision: search the firm at <a href="https://register.fca.org.uk" rel="external noopener noreferrer">register.fca.org.uk</a>. Every legitimate UK investment firm is authorised. If the firm or person isn\'t on there, walk away.'
				},
				{
					type: 'p',
					html: 'Then check the <a href="https://www.fca.org.uk/scamsmart/warning-list" rel="external noopener noreferrer">FCA Warning List</a>. The FCA publishes firms it has reason to believe are fraudulent. Active scams often appear on the list within days.'
				},
				{
					type: 'callout',
					tone: 'warn',
					html: 'Beware "clones": real firm names with fake contact details. The scammer copies an authorised firm\'s number from the register. Always call the firm using the number on the register, not the one in the pitch.'
				}
			]
		},
		{
			id: 'red-flags',
			heading: 'Red flags in any investment pitch',
			body: [
				{
					type: 'ul',
					items: [
						'Guaranteed returns. There is no such thing for retail investors.',
						'Pressure to deposit today, this week, before "the offer closes".',
						'A complicated, opaque story about how the returns are generated.',
						'Withdrawals that suddenly need a "fee", "tax" or "verification deposit".',
						'A platform that exists only as a website or an app, not on the FCA register.',
						"Cold contact: you didn't go looking for them, they came to you.",
						'Crypto. Not because all crypto is bad, but because it is the favoured rail of investment scammers and once your money is sent it is gone.'
					]
				}
			]
		},
		{
			id: 'safer-routes',
			heading: 'If you do want to invest, safer routes',
			body: [
				{
					type: 'p',
					html: "This isn't investment advice. But the following are the regulated, well-trodden routes UK retail investors use:"
				},
				{
					type: 'ul',
					items: [
						'A Stocks and Shares ISA through Vanguard, AJ Bell, Hargreaves Lansdown, Fidelity, InvestEngine or Trading 212.',
						'Pension contributions through your workplace scheme.',
						'A government-backed product like Premium Bonds.',
						'For higher-risk: a small percentage in established funds (S&P 500 trackers, FTSE All-World) via the platforms above. Never via a cold approach.'
					]
				},
				{
					type: 'p',
					html: 'Real platforms protect deposits up to £85,000 under the Financial Services Compensation Scheme. Scam platforms protect nothing.'
				}
			]
		},
		{
			id: 'if-you-have-already',
			heading: "If you've already deposited",
			body: [
				{
					type: 'ol',
					items: [
						'Stop sending money. The "small extra deposit" to unlock withdrawals is the trap; nothing comes back.',
						'Try to withdraw your full balance now. The platform will resist, often with new fees. The resistance itself confirms the scam.',
						'Call your bank. Recent investment-fraud transfers can sometimes be recalled.',
						'Report to <a href="https://www.actionfraud.police.uk" rel="external noopener noreferrer">Action Fraud</a> at 0300 123 2040.',
						'Report the firm to the <a href="https://www.fca.org.uk/consumers/report-scam-unauthorised-firm" rel="external noopener noreferrer">FCA</a>.',
						'Ignore any "recovery firm" that contacts you afterwards.'
					]
				},
				{
					type: 'p',
					html: 'Our guide on <a href="/guides/recover-from-being-scammed">what to do after being scammed</a> covers the longer recovery in detail.'
				}
			]
		}
	],
	faqs: [
		{
			q: 'Are crypto and "DeFi" investments always scams?',
			a: "No, but the scam-to-genuine ratio is much higher than in regulated markets, the technical complexity helps scammers, and there's no FSCS protection. If you do hold crypto, treat it as money you can lose entirely."
		},
		{
			q: 'I saw a Martin Lewis advert promoting an investment. Is it real?',
			a: 'No. Martin Lewis has publicly stated he does no paid investment endorsements ever. Any advert showing him recommending an investment platform is a scam, full stop.'
		},
		{
			q: 'My broker said the FCA register is wrong about them. What now?',
			a: "The FCA register is the source of truth. If a firm tells you the register is wrong, that's a scam in itself. Real authorised firms don't need to argue with the regulator that maintains their authorisation."
		},
		{
			q: 'Can the FCA recover my money?',
			a: "No, the FCA doesn't handle recovery. Money recovery happens through your bank, your card provider and (less often) the police. The FCA's job is preventing future losses by warning others."
		}
	],
	relatedPatterns: ['crypto-investment', 'romance-scam', 'job-offer'],
	relatedGuides: [
		'recover-from-being-scammed',
		'why-scammers-use-urgency',
		'protect-elderly-from-scams'
	]
};
