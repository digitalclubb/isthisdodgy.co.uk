import { guide as avoidInvestmentScams } from './avoid-investment-scams.ts';
import { guide as clickedAScamLink } from './clicked-a-scam-link.ts';
import { guide as protectElderlyFromScams } from './protect-elderly-from-scams.ts';
import { guide as recoverFromBeingScammed } from './recover-from-being-scammed.ts';
import { guide as reportAScamUk } from './report-a-scam-uk.ts';
import { guide as scamTextWarningSigns } from './scam-text-warning-signs.ts';
import { guide as spotAPhishingEmail } from './spot-a-phishing-email.ts';
import type { Guide } from './types.ts';
import { guide as whatsappScamPrevention } from './whatsapp-scam-prevention.ts';
import { guide as whyScammersUseUrgency } from './why-scammers-use-urgency.ts';

// Order matters for the hub page. Top-of-funnel "spot it" guides first,
// then "what to do" guides, then context / recovery.
export const GUIDES: Guide[] = [
	spotAPhishingEmail,
	scamTextWarningSigns,
	whatsappScamPrevention,
	whyScammersUseUrgency,
	clickedAScamLink,
	reportAScamUk,
	protectElderlyFromScams,
	avoidInvestmentScams,
	recoverFromBeingScammed
];

export function getGuide(slug: string): Guide | undefined {
	return GUIDES.find((g) => g.slug === slug);
}
