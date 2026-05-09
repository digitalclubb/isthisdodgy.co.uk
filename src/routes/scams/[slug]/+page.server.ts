import { error } from '@sveltejs/kit';
import { SCAM_PATTERNS } from '$lib/detect/data/scam-patterns';
import { GUIDES } from '$lib/guides/registry';
import type { EntryGenerator } from './$types.ts';

export const prerender = true;

export const entries: EntryGenerator = () => {
	return SCAM_PATTERNS.map((p) => ({ slug: p.slug }));
};

export function load({ params }) {
	const idx = SCAM_PATTERNS.findIndex((p) => p.slug === params.slug);
	if (idx === -1) throw error(404, 'Pattern not found');
	const pattern = SCAM_PATTERNS[idx]!;

	// Pick up to three sibling patterns (next, next+1, previous). Wraps around
	// so every page gets a full set, dedupes when the list is short.
	const total = SCAM_PATTERNS.length;
	const offsets = [1, 2, -1];
	const related = offsets
		.map((o) => SCAM_PATTERNS[(idx + o + total) % total])
		.filter((p, i, arr) => p.slug !== pattern.slug && arr.findIndex((q) => q.slug === p.slug) === i)
		.slice(0, 3)
		.map((p) => ({ slug: p.slug, name: p.name, summary: p.summary }));

	// Reverse-derive guide links: any guide that lists this pattern as related.
	// Cap at 3 to keep the block tight.
	const relatedGuides = GUIDES.filter((g) => g.relatedPatterns.includes(pattern.slug))
		.slice(0, 3)
		.map((g) => ({ slug: g.slug, title: g.title, description: g.description }));

	return {
		pattern: {
			slug: pattern.slug,
			name: pattern.name,
			headline: pattern.headline,
			summary: pattern.summary,
			advice: pattern.advice
		},
		related,
		relatedGuides
	};
}
