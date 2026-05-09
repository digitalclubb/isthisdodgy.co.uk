import { error } from '@sveltejs/kit';
import { detect } from '$lib/detect/index';

// Same shape as the RDAP enricher's domain regex. Disallows leading hyphen,
// double dots and other shapes the loose `.+\.[a-z]{2,}` would have allowed.
const VALID_DOMAIN_RE = /^[a-z0-9][a-z0-9.-]{1,251}[a-z0-9]\.[a-z]{2,}$/i;

export async function load({ params, setHeaders }) {
	const domain = params.domain.toLowerCase();
	if (!VALID_DOMAIN_RE.test(domain) || domain.length > 253 || domain.includes('..')) {
		throw error(404, 'Not a valid domain');
	}
	const verdict = await detect(domain);
	setHeaders({
		// 5 minutes at the edge keeps the Vercel function bill down. We avoid
		// stale-while-revalidate on this route because a verdict can flip from
		// safe to dodgy when a phishing feed updates and we don't want stale
		// "safe" answers shown for hours. stale-if-error protects against
		// brief upstream blips.
		'Cache-Control': 'public, max-age=0, s-maxage=300, stale-if-error=3600'
	});
	return { domain, verdict };
}
