import { error, json } from '@sveltejs/kit';
import { detect } from '$lib/detect/index';
import type { RequestHandler } from './$types.ts';

const MAX_BODY_BYTES = 16 * 1024;
const MAX_INPUT_CHARS = 4000;

export const POST: RequestHandler = async ({ request }) => {
	const lengthHeader = request.headers.get('content-length');
	if (lengthHeader && Number(lengthHeader) > MAX_BODY_BYTES) {
		throw error(413, 'Request body too large.');
	}

	const ct = request.headers.get('content-type') ?? '';
	let input = '';

	if (ct.includes('application/json')) {
		const body = (await request.json().catch(() => null)) as { input?: string } | null;
		input = body?.input ?? '';
	} else {
		const data = await request.formData();
		input = (data.get('input') ?? '').toString();
	}

	if (!input.trim()) {
		throw error(400, 'Provide an "input" string.');
	}
	if (input.length > MAX_INPUT_CHARS) {
		throw error(413, `Input too long. Max ${MAX_INPUT_CHARS} characters.`);
	}

	const verdict = await detect(input);
	return json(verdict, {
		headers: {
			'Cache-Control': 'no-store'
		}
	});
};
