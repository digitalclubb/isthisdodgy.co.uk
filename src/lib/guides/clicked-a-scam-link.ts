import type { Guide } from './types.ts';

export const guide: Guide = {
	slug: 'clicked-a-scam-link',
	title: 'I clicked a scam link, what should I do?',
	h1: 'I clicked a scam link. What now?',
	description:
		'A calm step-by-step UK guide. What to do if you clicked a phishing link, entered details, or lost money. The first hour matters most.',
	lede: "First, take a breath. Most people who click a scam link are fine, especially if they noticed quickly. Here's what to do, in order, depending on how far you got.",
	sections: [
		{
			id: 'just-clicked',
			heading: 'You only clicked the link',
			body: [
				{
					type: 'p',
					html: 'If you tapped the link but did not type anything, did not download anything and did not log in, the damage is usually small. Modern phones and browsers stop most malware automatically.'
				},
				{
					type: 'ol',
					items: [
						'Close the tab.',
						'Don\'t go back. Don\'t tap the back button to "see what it was".',
						"On Android, run a quick scan with the built-in Play Protect (Settings, Google, Play Protect). On iPhone, you don't need a virus scan.",
						'If you were on a work device, tell your IT team so they can block the page for everyone else.'
					]
				},
				{
					type: 'callout',
					tone: 'note',
					html: 'Just clicking is rarely a disaster. The dangerous bit is what comes next, when the page asks you to enter something.'
				}
			]
		},
		{
			id: 'entered-password',
			heading: 'You entered a password',
			body: [
				{
					type: 'p',
					html: 'Act fast. The scammer may already be logging into the real site with your details.'
				},
				{
					type: 'ol',
					items: [
						'Go to the real website (typed by hand, not from the email) and change the password right now.',
						'Change the same password on any other site that used it. Scammers try the same password everywhere.',
						'Turn on two-factor authentication on every account that supports it.',
						"Check the account for any logins, settings changes or transactions you didn't make."
					]
				}
			]
		},
		{
			id: 'entered-card',
			heading: 'You entered card or bank details',
			body: [
				{
					type: 'p',
					html: 'Call your bank now. Use the number on the back of your card, not any number from the scam page or email.'
				},
				{
					type: 'ol',
					items: [
						'Tell them what happened. They will lock or replace the card.',
						'Watch your account closely for the next 48 hours. Tiny test payments often appear before a big one.',
						'If money has already moved, ask them to start a fraud claim under the new APP reimbursement rules.',
						'Report it to <a href="https://www.actionfraud.police.uk" rel="external noopener noreferrer">Action Fraud</a> (0300 123 2040). In Scotland, call 101.'
					]
				}
			]
		},
		{
			id: 'entered-2fa-code',
			heading: 'You entered a one-time code',
			body: [
				{
					type: 'p',
					html: 'Treat this as the most urgent case. A scammer with your password and your 2FA code can do anything you can do on that account.'
				},
				{
					type: 'ol',
					items: [
						'Change the password on that account immediately. The new password will invalidate any active sessions.',
						"Sign out of all other sessions in the account's security settings.",
						'Turn on a stronger 2FA method (authenticator app or hardware key, not SMS).',
						'If it was a banking code, call your bank using the number on the back of your card.'
					]
				}
			]
		},
		{
			id: 'downloaded-something',
			heading: 'You downloaded a file',
			body: [
				{
					type: 'p',
					html: 'On a phone, deleting the app or file is usually enough. On a laptop or desktop, be more careful.'
				},
				{
					type: 'ol',
					items: [
						'Disconnect from the internet (turn off wifi).',
						'Run a full antivirus scan. Windows Defender (built into Windows) and the built-in macOS protection are both fine.',
						'If anything is found, follow the prompts to remove it.',
						'Change passwords for any accounts that use the same device, especially banking and email.'
					]
				}
			]
		},
		{
			id: 'check-and-monitor',
			heading: 'Check for damage over the next two weeks',
			body: [
				{
					type: 'ul',
					items: [
						'Watch your bank account for unusual transactions, even tiny ones.',
						'Check your email for password-reset requests you did not start.',
						'Check that no new addresses or phone numbers have been added to your accounts.',
						'Check your credit report. <a href="https://www.checkmyfile.com" rel="external noopener noreferrer">CheckMyFile</a> offers a free 30-day trial that pulls all four UK credit agencies.'
					]
				}
			]
		},
		{
			id: 'reporting',
			heading: 'Always report, even if no money was lost',
			body: [
				{
					type: 'p',
					html: 'Reporting helps everyone else. Action Fraud aggregates reports and the National Cyber Security Centre uses them to take down scam pages, often within hours.'
				},
				{
					type: 'ul',
					items: [
						'Phishing emails: forward to <a href="mailto:report@phishing.gov.uk">report@phishing.gov.uk</a>',
						'Scam texts: forward to 7726 (free)',
						'Lost money or fraud attempted: <a href="https://www.actionfraud.police.uk" rel="external noopener noreferrer">actionfraud.police.uk</a> or 0300 123 2040'
					]
				}
			]
		}
	],
	faqs: [
		{
			q: 'I just clicked the link and closed it. Is my phone infected?',
			a: 'Almost certainly not. Modern phones do not run software just because you visited a page. Risk only starts when the page asks you to download something or enter details, and you do.'
		},
		{
			q: 'I gave my card details. Will the bank refund me?',
			a: 'In most UK cases, yes. Since 7 October 2024 banks have to reimburse most authorised push-payment fraud. Report it to your bank within 13 months and you should be covered for losses up to £85,000.'
		},
		{
			q: 'Should I pay for a fancy antivirus after clicking a link?',
			a: 'No. Windows Defender on Windows and the built-in macOS protection are both fine for personal use. The free Bitdefender or Malwarebytes scanners are good for a one-off second opinion.'
		},
		{
			q: 'How do I tell if my email account was hacked after I entered the password?',
			a: 'Look for sign-ins from places you have not been (most email apps show this in security settings), forwarding rules you did not set, and emails in your sent folder that you did not send.'
		}
	],
	relatedPatterns: ['hmrc-tax-refund', 'bank-impersonation', 'royal-mail-fee'],
	relatedGuides: ['spot-a-phishing-email', 'recover-from-being-scammed', 'report-a-scam-uk']
};
