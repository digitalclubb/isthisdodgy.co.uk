export type GuideBlock =
	| { type: 'p'; html: string }
	| { type: 'ul'; items: string[] }
	| { type: 'ol'; items: string[] }
	| { type: 'callout'; tone: 'note' | 'warn'; html: string }
	| { type: 'h3'; text: string };

export type GuideSection = {
	id: string;
	heading: string;
	body: GuideBlock[];
};

export type GuideFaq = {
	q: string;
	a: string;
};

export type Guide = {
	slug: string;
	title: string;
	h1: string;
	description: string;
	lede: string;
	sections: GuideSection[];
	faqs: GuideFaq[];
	relatedPatterns: string[];
	relatedGuides: string[];
	// ISO date string. When omitted, the build date is used.
	dateModified?: string;
	datePublished?: string;
};
