import { error } from '@sveltejs/kit';
import { SCAM_PATTERNS } from '$lib/detect/data/scam-patterns';
import { GUIDES, getGuide } from '$lib/guides/registry';
import type { EntryGenerator } from './$types.ts';

export const prerender = true;

export const entries: EntryGenerator = () => {
	return GUIDES.map((g) => ({ slug: g.slug }));
};

export function load({ params }) {
	const guide = getGuide(params.slug);
	if (!guide) throw error(404, 'Guide not found');

	const relatedPatterns = guide.relatedPatterns
		.map((slug) => SCAM_PATTERNS.find((p) => p.slug === slug))
		.filter((p): p is NonNullable<typeof p> => p !== undefined)
		.map((p) => ({ slug: p.slug, name: p.name }));

	const relatedGuides = guide.relatedGuides
		.map((slug) => getGuide(slug))
		.filter((g): g is NonNullable<typeof g> => g !== undefined)
		.map((g) => ({ slug: g.slug, title: g.title, description: g.description }));

	return {
		guide,
		relatedPatterns,
		relatedGuides
	};
}
