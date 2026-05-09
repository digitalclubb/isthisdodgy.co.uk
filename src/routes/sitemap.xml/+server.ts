import { SCAM_PATTERNS } from '$lib/detect/data/scam-patterns';
import { GUIDES } from '$lib/guides/registry';
import { LAST_UPDATED } from '$lib/seo';
import { SITE } from '$lib/site';
import type { RequestHandler } from './$types.ts';

export const prerender = true;

const STATIC_PATHS: { path: string; changefreq: string; priority: string; lastmod: string }[] = [
	{ path: '/', changefreq: 'weekly', priority: '1.0', lastmod: LAST_UPDATED.site },
	{ path: '/guides', changefreq: 'weekly', priority: '0.9', lastmod: LAST_UPDATED.guides },
	{ path: '/scams', changefreq: 'weekly', priority: '0.9', lastmod: LAST_UPDATED.patterns },
	{ path: '/about', changefreq: 'monthly', priority: '0.5', lastmod: LAST_UPDATED.site },
	{ path: '/privacy', changefreq: 'monthly', priority: '0.4', lastmod: LAST_UPDATED.site },
	{ path: '/report', changefreq: 'monthly', priority: '0.7', lastmod: LAST_UPDATED.site }
];

export const GET: RequestHandler = () => {
	const entries = [
		...STATIC_PATHS.map((p) => ({
			loc: `${SITE.url}${p.path}`,
			lastmod: p.lastmod,
			changefreq: p.changefreq,
			priority: p.priority
		})),
		...GUIDES.map((g) => ({
			loc: `${SITE.url}/guides/${g.slug}`,
			lastmod: LAST_UPDATED.guides,
			changefreq: 'monthly',
			priority: '0.8'
		})),
		...SCAM_PATTERNS.map((p) => ({
			loc: `${SITE.url}/scams/${p.slug}`,
			lastmod: LAST_UPDATED.patterns,
			changefreq: 'monthly',
			priority: '0.7'
		}))
	];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map(
		(u) =>
			`	<url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
