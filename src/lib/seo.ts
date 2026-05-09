import { SITE } from './site.ts';

// /og.png is rendered dynamically on Vercel from src/routes/og.png/+server.ts.
// Bump the version when the design changes so social caches refresh.
export const OG_IMAGE = `${SITE.url}/og.png?v=1`;

// Build-time date injected via Vite's `define` (see vite.config.ts). The
// fallback only runs in non-Vite contexts (smoke tests). Tracking the build
// date means lastmod moves with real deploys, not a hardcoded literal that
// rots between releases.
declare const __BUILD_DATE__: string;
const BUILD_DATE =
	typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : new Date().toISOString().slice(0, 10);

export const LAST_UPDATED = {
	site: BUILD_DATE,
	patterns: BUILD_DATE,
	guides: BUILD_DATE
};

type JsonLd = Record<string, unknown>;

export function websiteJsonLd(): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: SITE.name,
		url: SITE.url,
		description: SITE.description,
		potentialAction: {
			'@type': 'SearchAction',
			// Google substitutes {search_term_string} with the user's query
			// already URL-encoded, and the home page reads `q` via
			// page.url.searchParams.get('q') which decodes correctly.
			target: {
				'@type': 'EntryPoint',
				urlTemplate: `${SITE.url}/?q={search_term_string}`
			},
			'query-input': 'required name=search_term_string'
		}
	};
}

export function organizationJsonLd(): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: SITE.name,
		url: SITE.url,
		logo: OG_IMAGE,
		description: SITE.description,
		areaServed: 'GB'
	};
}

export type BreadcrumbCrumb = { name: string; href: string };

export function breadcrumbsJsonLd(crumbs: BreadcrumbCrumb[]): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: crumbs.map((c, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: c.name,
			item: c.href.startsWith('http') ? c.href : `${SITE.url}${c.href}`
		}))
	};
}

export function articleJsonLd(args: {
	title: string;
	description: string;
	path: string;
	dateModified?: string;
	datePublished?: string;
}): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: args.title,
		description: args.description,
		mainEntityOfPage: `${SITE.url}${args.path}`,
		image: OG_IMAGE,
		datePublished: args.datePublished ?? LAST_UPDATED.site,
		dateModified: args.dateModified ?? LAST_UPDATED.guides,
		author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
		publisher: {
			'@type': 'Organization',
			name: SITE.name,
			url: SITE.url,
			logo: { '@type': 'ImageObject', url: OG_IMAGE }
		}
	};
}

export type FaqEntry = { question: string; answer: string };

export function faqPageJsonLd(faqs: FaqEntry[]): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((f) => ({
			'@type': 'Question',
			name: f.question,
			acceptedAnswer: { '@type': 'Answer', text: f.answer }
		}))
	};
}
