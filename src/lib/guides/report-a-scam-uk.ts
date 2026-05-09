import type { Guide } from './types.ts';

export const guide: Guide = {
	slug: 'report-a-scam-uk',
	title: 'How to report a scam in the UK',
	h1: 'How to report a scam in the UK',
	description:
		'Every UK route to report a scam, in plain English. Texts, emails, websites, calls, lost money. All free, takes a few minutes each.',
	lede: "Reporting a scam is the single most useful thing you can do. The systems below are free, take a few minutes and feed real takedowns and prosecutions. Here's the right route for what happened to you.",
	sections: [
		{
			id: 'scam-text',
			heading: 'Scam text messages',
			body: [
				{
					type: 'p',
					html: 'Forward the text to <strong>7726</strong>. The keys spell SPAM. It is free, even on pay-as-you-go.'
				},
				{
					type: 'p',
					html: "When you forward, you may get an automated reply asking for the sender's number. Send that as a follow-up. Then delete the text."
				},
				{
					type: 'p',
					html: "7726 goes straight to your mobile network's abuse team. They use the reports to block scam senders for every customer."
				}
			]
		},
		{
			id: 'scam-email',
			heading: 'Scam emails',
			body: [
				{
					type: 'p',
					html: 'Forward to <a href="mailto:report@phishing.gov.uk">report@phishing.gov.uk</a>. This is run by the National Cyber Security Centre. They take down phishing sites, often within hours.'
				},
				{
					type: 'p',
					html: 'For scams pretending to be from specific organisations, forward to them as well:'
				},
				{
					type: 'ul',
					items: [
						'HMRC: <a href="mailto:phishing@hmrc.gov.uk">phishing@hmrc.gov.uk</a>',
						'Royal Mail: <a href="mailto:reportascam@royalmail.com">reportascam@royalmail.com</a>',
						'TV Licensing: <a href="mailto:phishing@tvlicensing.co.uk">phishing@tvlicensing.co.uk</a>',
						'Your bank: most have a "report a scam email" address on their website. NatWest uses <a href="mailto:phishing@natwest.com">phishing@natwest.com</a>.'
					]
				}
			]
		},
		{
			id: 'scam-website',
			heading: 'Scam websites',
			body: [
				{
					type: 'p',
					html: 'Report to the National Cyber Security Centre at <a href="https://www.ncsc.gov.uk/section/about-this-website/report-scam-website" rel="external noopener noreferrer">ncsc.gov.uk/report-scam-website</a>. The form takes about a minute.'
				},
				{
					type: 'p',
					html: 'For sites pretending to be a brand, also tell that brand. Most have a "Contact us" or "Report fraud" page. They have direct relationships with hosting companies and can speed up takedown.'
				}
			]
		},
		{
			id: 'scam-call',
			heading: 'Scam phone calls',
			body: [
				{
					type: 'p',
					html: 'For nuisance and scam calls in general, report to the <a href="https://ico.org.uk/make-a-complaint/nuisance-calls-and-messages/" rel="external noopener noreferrer">Information Commissioner\'s Office</a>. Their form asks for the number, time and what was said.'
				},
				{
					type: 'p',
					html: 'For scam calls pretending to be from your bank, call the bank using the number on the back of your card and tell them about the call. They will log it and warn other customers.'
				}
			]
		},
		{
			id: 'lost-money',
			heading: "You've lost money or someone tried to take it",
			body: [
				{
					type: 'p',
					html: "Report to <strong>Action Fraud</strong>. They are the UK's national reporting centre for fraud and cyber crime, run alongside the City of London Police."
				},
				{
					type: 'ul',
					items: [
						'Online: <a href="https://www.actionfraud.police.uk" rel="external noopener noreferrer">actionfraud.police.uk</a>',
						'Phone: 0300 123 2040 (check the website for current opening hours)',
						'In Scotland: call <strong>101</strong> (Police Scotland handles fraud directly)'
					]
				},
				{
					type: 'p',
					html: "You'll get a crime reference number. Keep it. Your bank, card provider or insurance might ask for it later."
				},
				{
					type: 'callout',
					tone: 'warn',
					html: "If you've just sent money, call your bank first, before you do anything else. Speed matters most in the first hour."
				}
			]
		},
		{
			id: 'identity-theft',
			heading: 'You think your identity has been stolen',
			body: [
				{
					type: 'p',
					html: 'Contact <a href="https://www.cifas.org.uk/services/identity-protection/protective-registration" rel="external noopener noreferrer">Cifas</a> for Protective Registration. It is a paid two-year service that tells lenders to do extra checks before opening anything new in your name.'
				},
				{
					type: 'p',
					html: 'Pull your credit file from all three UK agencies (Experian, Equifax, TransUnion) and look for accounts you did not open. <a href="https://www.checkmyfile.com" rel="external noopener noreferrer">CheckMyFile</a> shows all three with a free 30-day trial.'
				}
			]
		},
		{
			id: 'help-others',
			heading: 'Tell other people',
			body: [
				{
					type: 'p',
					html: 'Most scams target the same group of people repeatedly. Friends, parents and neighbours benefit hugely from a one-line warning ("there\'s a fake Royal Mail text going round, just so you know"). Public Telegraph and Facebook groups are also useful, but a single text to a relative is more effective.'
				}
			]
		}
	],
	faqs: [
		{
			q: 'Will Action Fraud get my money back?',
			a: "Action Fraud doesn't investigate individual cases or recover money. They aggregate reports for the National Fraud Intelligence Bureau, which directs investigations. To get money back, work with your bank."
		},
		{
			q: 'Is 7726 really free?',
			a: 'Yes. It works on every UK network and on pay-as-you-go phones. You will not be charged for forwarding the text or for the auto-reply.'
		},
		{
			q: 'Do I need to report it if no money was lost?',
			a: 'It still helps. Reports of attempted scams are how takedowns and prosecutions get prioritised. Even an unsuccessful scam is worth a one-line forward.'
		},
		{
			q: 'I reported it weeks ago and heard nothing back.',
			a: 'Action Fraud rarely contacts individuals about a single report. The work happens in aggregate. If you want a status update, call them with your crime reference number.'
		}
	],
	relatedPatterns: ['royal-mail-fee', 'hi-mum-whatsapp', 'hmrc-tax-refund'],
	relatedGuides: ['clicked-a-scam-link', 'recover-from-being-scammed', 'spot-a-phishing-email']
};
