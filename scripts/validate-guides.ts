// Build-time sanity check on guide content. Run via `pnpm run validate:guides`.
// Asserts:
//   - no <script> or javascript: in any rendered HTML field (defense in depth
//     for the {@html} sinks in GuideBlock.svelte)
//   - every guide has at least one section and one FAQ
//   - every relatedPatterns slug resolves to an existing pattern
//   - every relatedGuides slug resolves to an existing guide
import { SCAM_PATTERNS } from '../src/lib/detect/data/scam-patterns.ts';
import { GUIDES } from '../src/lib/guides/registry.ts';
import type { GuideBlock } from '../src/lib/guides/types.ts';

const SCRIPT_RE = /<script\b|javascript:|on\w+\s*=/i;
let failures = 0;

function fail(where: string, message: string) {
	console.error(`✗ ${where}: ${message}`);
	failures++;
}

function checkHtml(where: string, html: string) {
	if (SCRIPT_RE.test(html)) {
		fail(where, `contains a forbidden HTML pattern (script, javascript: or on*= handler)`);
	}
}

function walkBlock(where: string, block: GuideBlock) {
	if (block.type === 'p' || block.type === 'callout') {
		checkHtml(where, block.html);
	} else if (block.type === 'ul' || block.type === 'ol') {
		for (const item of block.items) checkHtml(where, item);
	}
}

const patternSlugs = new Set(SCAM_PATTERNS.map((p) => p.slug));
const guideSlugs = new Set(GUIDES.map((g) => g.slug));

for (const g of GUIDES) {
	const where = `guides/${g.slug}`;
	if (g.sections.length === 0) fail(where, 'has no sections');
	if (g.faqs.length === 0) fail(where, 'has no FAQs');

	for (const section of g.sections) {
		for (const block of section.body) {
			walkBlock(`${where}#${section.id}`, block);
		}
	}
	for (const faq of g.faqs) {
		checkHtml(`${where}/faq:${faq.q.slice(0, 30)}`, faq.a);
	}

	for (const slug of g.relatedPatterns) {
		if (!patternSlugs.has(slug)) {
			fail(where, `relatedPatterns references unknown pattern "${slug}"`);
		}
	}
	for (const slug of g.relatedGuides) {
		if (!guideSlugs.has(slug)) {
			fail(where, `relatedGuides references unknown guide "${slug}"`);
		}
		if (slug === g.slug) {
			fail(where, `relatedGuides links to itself`);
		}
	}
	console.log(`✓ ${where}`);
}

if (failures > 0) {
	console.error(`\n${failures} validation failure(s).`);
	process.exit(1);
}
console.log(`\nAll ${GUIDES.length} guides valid.`);
