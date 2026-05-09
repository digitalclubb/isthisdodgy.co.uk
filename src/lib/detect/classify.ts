import type { InputType } from './verdict.ts';

const URL_RE = /\b((?:https?:\/\/|www\.)[^\s<>"']+|[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\/[^\s<>"']*)?)/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_LIKE_RE = /^[+()\d\s\-./]{6,}$/;

export type Classification = {
	type: InputType;
	value: string;
};

export function classifyInput(raw: string): Classification {
	const trimmed = raw.trim();
	if (!trimmed) return { type: 'unknown', value: '' };

	const oneLine = trimmed.replace(/\s+/g, ' ');
	const wordCount = oneLine.split(' ').length;

	if (EMAIL_RE.test(oneLine) && wordCount === 1) {
		return { type: 'email', value: oneLine.toLowerCase() };
	}

	// Phone numbers commonly include spaces ("+44 7700 900 123"). Allow them
	// as long as the entire string is phone-shaped characters.
	if (PHONE_LIKE_RE.test(oneLine)) {
		const digits = oneLine.replace(/\D/g, '');
		if (digits.length >= 6 && digits.length <= 15) {
			return { type: 'phone', value: oneLine };
		}
	}

	const urlMatch = oneLine.match(URL_RE);
	if (urlMatch && wordCount <= 3) {
		return { type: 'url', value: urlMatch[0] };
	}

	if (trimmed.length > 0 && wordCount > 1) {
		return { type: 'text', value: trimmed };
	}

	if (urlMatch) {
		return { type: 'url', value: urlMatch[0] };
	}

	return { type: 'unknown', value: trimmed };
}
