// UK brands frequently impersonated in scams. Each entry maps the brand name
// to its legitimate root domains. A URL that looks like a brand but doesn't
// match the legitimate domain is a strong impersonation signal.
export const UK_IMPERSONATED_BRANDS: Record<string, string[]> = {
	'royal mail': ['royalmail.com', 'royalmail.co.uk'],
	royalmail: ['royalmail.com', 'royalmail.co.uk'],
	evri: ['evri.com'],
	hermes: ['evri.com', 'myhermes.co.uk'],
	dpd: ['dpd.co.uk', 'dpd.com'],
	dhl: ['dhl.com', 'dhl.co.uk'],
	parcelforce: ['parcelforce.com'],
	hmrc: ['gov.uk', 'hmrc.gov.uk'],
	'gov.uk': ['gov.uk'],
	natwest: ['natwest.com', 'natwest.co.uk'],
	barclays: ['barclays.co.uk', 'barclays.com'],
	lloyds: ['lloydsbank.com', 'lloydsbank.co.uk'],
	halifax: ['halifax.co.uk'],
	santander: ['santander.co.uk', 'santander.com'],
	hsbc: ['hsbc.co.uk', 'hsbc.com'],
	monzo: ['monzo.com'],
	starling: ['starlingbank.com'],
	nationwide: ['nationwide.co.uk'],
	paypal: ['paypal.com', 'paypal.co.uk'],
	amazon: ['amazon.co.uk', 'amazon.com'],
	apple: ['apple.com'],
	microsoft: ['microsoft.com'],
	netflix: ['netflix.com'],
	'tv licence': ['tvlicensing.co.uk'],
	'tv licensing': ['tvlicensing.co.uk'],
	dvla: ['gov.uk'],
	tfl: ['tfl.gov.uk'],
	'transport for london': ['tfl.gov.uk'],
	'congestion charge': ['tfl.gov.uk']
};
