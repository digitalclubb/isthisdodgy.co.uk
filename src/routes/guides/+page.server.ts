import { GUIDES } from '$lib/guides/registry';

export const prerender = true;

export function load() {
	return {
		guides: GUIDES.map((g) => ({
			slug: g.slug,
			title: g.title,
			description: g.description
		}))
	};
}
