import { error } from '@sveltejs/kit';
import { detect } from '$lib/detect/index';

export async function load({ params, setHeaders }) {
	const raw = decodeURIComponent(params.number);
	const digitsOnly = raw.replace(/\D/g, '');
	if (digitsOnly.length < 6 || digitsOnly.length > 15) {
		throw error(404, 'Not a valid phone number');
	}
	const verdict = await detect(raw);
	setHeaders({
		// Phone verdicts now include real-time IPQS data, so we want fresher
		// edge cache. 1 hour at the CDN with stale-if-error keeps the page
		// snappy without serving day-old fraud signals.
		'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-if-error=21600'
	});
	// Pass through the original encoded path segment so the canonical URL we
	// emit matches the URL the request actually arrived at, byte for byte.
	return { raw, slug: params.number, verdict };
}
