import { type Actions, fail } from '@sveltejs/kit';
import { detect } from '$lib/detect/index';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const input = (data.get('input') ?? '').toString();
		if (!input.trim()) {
			return fail(400, { error: 'Paste something to check.', input });
		}
		if (input.length > 4000) {
			return fail(413, { error: 'That message is too long. Trim it down a bit.', input });
		}
		const verdict = await detect(input);
		return { verdict, input };
	}
} satisfies Actions;
