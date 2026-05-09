import { SCAM_PATTERNS } from '$lib/detect/data/scam-patterns';

export const prerender = true;

export function load() {
	return {
		patterns: SCAM_PATTERNS.map((p) => ({
			slug: p.slug,
			name: p.name,
			summary: p.summary
		}))
	};
}
