<script lang="ts">
	import GuideBlock from '$lib/components/GuideBlock.svelte';
	import JsonLd from '$lib/components/JsonLd.svelte';
	import { articleJsonLd, breadcrumbsJsonLd, faqPageJsonLd, OG_IMAGE } from '$lib/seo';
	import { SITE } from '$lib/site';

	let { data } = $props();
	const url = $derived(`${SITE.url}/guides/${data.guide.slug}`);

	const article = $derived(
		articleJsonLd({
			title: data.guide.title,
			description: data.guide.description,
			path: `/guides/${data.guide.slug}`,
			datePublished: data.guide.datePublished,
			dateModified: data.guide.dateModified
		})
	);
	const breadcrumbs = $derived(
		breadcrumbsJsonLd([
			{ name: 'Home', href: '/' },
			{ name: 'Guides', href: '/guides' },
			{ name: data.guide.title, href: `/guides/${data.guide.slug}` }
		])
	);
	const faq = $derived(
		faqPageJsonLd(data.guide.faqs.map((f) => ({ question: f.q, answer: f.a })))
	);
</script>

<svelte:head>
	<title>{data.guide.title} | {SITE.name}</title>
	<meta name="description" content={data.guide.description} />
	<link rel="canonical" href={url} />
	<meta property="og:title" content={data.guide.title} />
	<meta property="og:description" content={data.guide.description} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={OG_IMAGE} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={OG_IMAGE} />
</svelte:head>

<JsonLd data={article} />
<JsonLd data={breadcrumbs} />
<JsonLd data={faq} />

<article class="guide">
	<p class="kicker">UK scam guide</p>
	<h1>{data.guide.h1}</h1>
	<p class="lede">{data.guide.lede}</p>

	<nav class="toc" aria-label="On this page">
		<p class="toc-title">In this guide</p>
		<ul>
			{#each data.guide.sections as s}
				<li><a href="#{s.id}">{s.heading}</a></li>
			{/each}
			<li><a href="#faq">Common questions</a></li>
		</ul>
	</nav>

	{#each data.guide.sections as section}
		<section id={section.id} class="section">
			<h2>{section.heading}</h2>
			{#each section.body as block}
				<GuideBlock {block} />
			{/each}
		</section>
	{/each}

	<section id="faq" class="faq">
		<h2>Common questions</h2>
		<dl>
			{#each data.guide.faqs as f}
				<dt>{f.q}</dt>
				<dd>{@html f.a}</dd>
			{/each}
		</dl>
	</section>

	<aside class="cta">
		<p>
			Got something specific to check?
			<a href="/">Paste it on the home page</a> for a calm second opinion.
		</p>
	</aside>

	{#if data.relatedGuides.length > 0}
		<section class="related">
			<h2>More guides</h2>
			<ul>
				{#each data.relatedGuides as g}
					<li>
						<a href="/guides/{g.slug}">
							<span class="related-name">{g.title}</span>
							<span class="related-summary">{g.description}</span>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#if data.relatedPatterns.length > 0}
		<section class="patterns">
			<h2>Related UK scam patterns</h2>
			<ul>
				{#each data.relatedPatterns as p}
					<li><a href="/scams/{p.slug}">{p.name}</a></li>
				{/each}
			</ul>
		</section>
	{/if}
</article>

<style>
	.guide {
		max-width: 64ch;
	}
	.kicker {
		margin: var(--space-5) 0 var(--space-2);
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--ink-mute);
		font-weight: 600;
	}
	h1 {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: clamp(2rem, 5vw + 0.8rem, 2.8rem);
		letter-spacing: -0.02em;
		margin: 0 0 var(--space-3);
		line-height: 1.1;
	}
	.lede {
		font-size: 1.15rem;
		color: var(--ink-soft);
		margin: 0 0 var(--space-6);
	}
	.toc {
		margin: var(--space-5) 0 var(--space-6);
		padding: var(--space-4);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--paper-2);
	}
	.toc-title {
		margin: 0 0 var(--space-2);
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--ink-mute);
		font-weight: 600;
	}
	.toc ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}
	.toc a {
		color: var(--ink-soft);
		text-decoration: none;
	}
	.toc a:hover {
		text-decoration: underline;
	}
	.section {
		margin-top: var(--space-7);
	}
	.section h2,
	.faq h2,
	.related h2,
	.patterns h2 {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1.4rem;
		margin: 0 0 var(--space-3);
		letter-spacing: -0.01em;
	}
	.faq {
		margin-top: var(--space-7);
	}
	.faq dl {
		margin: 0;
	}
	.faq dt {
		font-weight: 600;
		margin-top: var(--space-4);
	}
	.faq dd {
		margin: var(--space-2) 0 0;
		color: var(--ink-soft);
	}
	.cta {
		margin-top: var(--space-7);
		padding: var(--space-4);
		background: var(--paper-2);
		border: 1px solid var(--line);
		border-radius: var(--radius);
	}
	.cta p {
		margin: 0;
		color: var(--ink-soft);
	}
	.related,
	.patterns {
		margin-top: var(--space-7);
	}
	.related ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}
	.related a {
		display: block;
		padding: var(--space-3) var(--space-4);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		text-decoration: none;
		color: var(--ink);
		transition: border-color 120ms ease;
	}
	.related a:hover {
		border-color: var(--ink-soft);
	}
	.related-name {
		display: block;
		font-weight: 600;
		font-size: 1rem;
	}
	.related-summary {
		display: block;
		margin-top: var(--space-1);
		color: var(--ink-soft);
		font-size: 0.92rem;
	}
	.patterns ul {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.patterns a {
		display: inline-block;
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--line);
		border-radius: 999px;
		text-decoration: none;
		color: var(--ink-soft);
		font-size: 0.9rem;
	}
	.patterns a:hover {
		border-color: var(--ink-soft);
		color: var(--ink);
	}
</style>
