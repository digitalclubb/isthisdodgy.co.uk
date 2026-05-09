import type { Guide } from './types.ts';

export const guide: Guide = {
	slug: 'why-scammers-use-urgency',
	title: 'Why scammers use urgency (and how to spot it)',
	h1: 'Why scammers use urgency',
	description:
		'How urgency works on the human brain, why it makes smart people fall for scams, and the simple habit that defuses it.',
	lede: 'Almost every successful scam shares one ingredient: pressure. Understanding why it works is the most useful thing you can do to stop it working on you.',
	sections: [
		{
			id: 'how-it-works',
			heading: 'How urgency works on the brain',
			body: [
				{
					type: 'p',
					html: "Under time pressure, your brain switches from careful, slow thinking to fast, intuitive thinking. Daniel Kahneman called these System 1 and System 2. System 2 spots scams. System 1 doesn't."
				},
				{
					type: 'p',
					html: 'A real bank fraud team takes its time. They have you on a recorded line, they confirm details slowly, they offer to call you back. A scam fraud team races. The race is the whole point. Speed bypasses scepticism.'
				}
			]
		},
		{
			id: 'classic-phrases',
			heading: 'The phrases that signal pressure',
			body: [
				{
					type: 'p',
					html: 'Once you start noticing them, urgency phrases jump out:'
				},
				{
					type: 'ul',
					items: [
						'"You need to act in the next 10 minutes."',
						'"This is your final notice."',
						'"Your account will be locked tonight."',
						'"The fraud team is on the line, please don\'t hang up."',
						'"We need to move your money to a safe account, right now."',
						'"This deal expires today."',
						'"Police are at your address shortly unless you pay."'
					]
				},
				{
					type: 'p',
					html: 'Real institutions don\'t communicate this way. They write you a letter. They send you to the website to log in. They say "take your time, ring us back when you can".'
				}
			]
		},
		{
			id: 'fear-shame-greed',
			heading: 'The three emotional triggers',
			body: [
				{
					type: 'h3',
					text: 'Fear'
				},
				{
					type: 'p',
					html: "Threats of arrest, fines, account suspension, lost parcels. Fear is the most reliable trigger because it's automatic. Even when you intellectually know it's probably a scam, the body reacts first."
				},
				{
					type: 'h3',
					text: 'Shame'
				},
				{
					type: 'p',
					html: '"You\'ve been watched. Pay this or we release the footage." "Don\'t tell your family, this investigation is confidential." Shame keeps you isolated, which is exactly what the scammer needs.'
				},
				{
					type: 'h3',
					text: 'Greed'
				},
				{
					type: 'p',
					html: '"You\'ve won." "Limited spots in this exclusive investment." "Your ex inherited £50k and you\'re named in the will." Greed lowers the bar on plausibility.'
				}
			]
		},
		{
			id: 'why-it-works-on-you',
			heading: 'Why it works on smart people',
			body: [
				{
					type: 'p',
					html: "Falling for a scam doesn't mean you're unintelligent. The single biggest factor is when the scam reaches you, not who you are. Tired, mid-task, distracted, in the school run, on hold for something else: that's when System 1 is in charge and the script lands."
				},
				{
					type: 'p',
					html: 'Professional scam call centres run thousands of calls a day. They optimise the script for what works. By the time it reaches you, the script has been refined on hundreds of people who fell for it.'
				}
			]
		},
		{
			id: 'the-pause',
			heading: 'The single habit that defuses urgency',
			body: [
				{
					type: 'p',
					html: "Refuse to act now. That's it. Whether it's a phone call, a text, an email or a doorbell, the rule is:"
				},
				{
					type: 'callout',
					tone: 'note',
					html: 'Hang up. Take five minutes. Verify through a channel you started yourself.'
				},
				{
					type: 'p',
					html: 'Five minutes is enough to break the spell. After five minutes you can ring the bank back on the number on your card. You can paste the message into our checker. You can call your relative on a different line. You can ask a friend.'
				},
				{
					type: 'p',
					html: 'The pause is the protection. If a "fraud team" complains that you want to verify by ringing back, that complaint is the proof.'
				}
			]
		},
		{
			id: 'rehearse',
			heading: 'Rehearse the pause',
			body: [
				{
					type: 'p',
					html: 'In the moment, panic edits out the things you should remember. So agree the script in advance, ideally with someone in your household:'
				},
				{
					type: 'ul',
					items: [
						'"I never act on a call from an unknown number. I will hang up and ring back."',
						'"I never give a one-time code by phone, even to someone claiming to be from my bank."',
						'"I never send money in the next 30 minutes, no matter what."',
						'"If I\'m being told not to tell my family, that\'s a red flag in itself."'
					]
				}
			]
		},
		{
			id: 'when-its-real',
			heading: '"But what if it really is urgent?"',
			body: [
				{
					type: 'p',
					html: "Here's the comforting truth: real urgency almost never has a same-day deadline that you must meet through a stranger's instructions."
				},
				{
					type: 'ul',
					items: [
						'A real bank fraud event will block the suspect transaction first, then call you. The money is already safe.',
						'A real HMRC matter will arrive in writing first. They give weeks, not minutes.',
						"A real family emergency lets you call back through normal channels. If the person on the line refuses, that's the tell."
					]
				},
				{
					type: 'p',
					html: "In the rare case the urgency is real, your five-minute pause makes no difference. In the vastly more common case it's a scam, the pause saves you."
				}
			]
		}
	],
	faqs: [
		{
			q: "Why do I freeze when scammers pressure me, even when I know it's a scam?",
			a: "It's a normal stress response. Adrenaline narrows attention onto the immediate problem and makes calm thinking harder. The fix is the pause itself: stepping out of the conversation breaks the loop."
		},
		{
			q: 'Are scammers actually trained?',
			a: 'Many are. Large scam operations train staff with scripts, role-plays and call-quality reviews, like a legitimate call centre. The polish is part of why they sound credible.'
		},
		{
			q: 'What if my bank really does call about fraud?',
			a: "Hang up and ring them back on the number on the card. They support this. Real fraud teams expect customers to verify, and they'll wait while you do."
		},
		{
			q: 'How do I get my elderly parent to use the pause?',
			a: 'Make it concrete: write the rule on a sticky note next to the phone. "I will hang up and ring 0300 123 2040 (Action Fraud) before I do anything." A physical reminder beats abstract advice when adrenaline is high.'
		}
	],
	relatedPatterns: ['bank-impersonation', 'hi-mum-whatsapp', 'crypto-investment'],
	relatedGuides: ['protect-elderly-from-scams', 'spot-a-phishing-email', 'scam-text-warning-signs']
};
