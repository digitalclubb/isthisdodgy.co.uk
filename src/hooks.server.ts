import type { Handle } from '@sveltejs/kit';
import { checkRateLimit } from '$lib/server/rate-limit';

// Routes that fan out to external APIs (some of them paid). Prerendered pages
// and static assets never reach this hook in production, and the rest of the
// dynamic routes are cheap, so we only rate-limit these.
function isExpensive(method: string, pathname: string): boolean {
	if (method === 'POST' && (pathname === '/' || pathname === '/api/check')) return true;
	if (method === 'GET' && (pathname.startsWith('/url/') || pathname.startsWith('/number/'))) {
		return true;
	}
	return false;
}

export const handle: Handle = async ({ event, resolve }) => {
	if (isExpensive(event.request.method, event.url.pathname)) {
		let ip = 'unknown';
		try {
			ip = event.getClientAddress();
		} catch {
			// Some environments can't determine the address; treat them as one bucket.
		}
		const verdict = checkRateLimit(ip);
		if (!verdict.ok) {
			return new Response('Too many requests. Please wait a moment and try again.', {
				status: 429,
				headers: {
					'retry-after': String(verdict.retryAfterSeconds),
					'content-type': 'text/plain; charset=utf-8'
				}
			});
		}
	}
	return resolve(event);
};
