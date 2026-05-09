<script lang="ts">
	import JsonLd from '$lib/components/JsonLd.svelte';
	import { articleJsonLd, breadcrumbsJsonLd, OG_IMAGE } from '$lib/seo';
	import { SITE } from '$lib/site';

	let { data } = $props();
	const url = $derived(`${SITE.url}/scams/${data.pattern.slug}`);
	const article = $derived(
		articleJsonLd({
			title: data.pattern.headline,
			description: data.pattern.summary,
			path: `/scams/${data.pattern.slug}`
		})
	);
	const breadcrumbs = $derived(
		breadcrumbsJsonLd([
			{ name: 'Home', href: '/' },
			{ name: 'Common UK scams', href: '/scams' },
			{ name: data.pattern.name, href: `/scams/${data.pattern.slug}` }
		])
	);
</script>

<svelte:head>
	<title>{data.pattern.name} | {SITE.name}</title>
	<meta name="description" content={data.pattern.summary} />
	<link rel="canonical" href={url} />
	<meta property="og:title" content={data.pattern.name} />
	<meta property="og:description" content={data.pattern.summary} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={OG_IMAGE} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={OG_IMAGE} />
</svelte:head>

<JsonLd data={article} />
<JsonLd data={breadcrumbs} />

<article class="prose">
	<p class="kicker">UK scam pattern</p>
	<h1>{data.pattern.name}</h1>
	<p class="summary">{data.pattern.summary}</p>

	<section class="advice">
		<h2>What to do</h2>
		<ul>
			{#each data.pattern.advice as tip}
				<li>{tip}</li>
			{/each}
		</ul>
	</section>

	<section class="back">
		<p>
			Got a specific message you want to check?
			<a href="/">Paste it on the home page</a> and we'll have a look.
		</p>
	</section>

	<section class="related">
		<h2>Other UK scams to watch for</h2>
		<ul>
			{#each data.related as r}
				<li>
					<a href="/scams/{r.slug}">
						<span class="related-name">{r.name}</span>
						<span class="related-summary">{r.summary}</span>
					</a>
				</li>
			{/each}
		</ul>
	</section>

	{#if data.relatedGuides?.length > 0}
		<section class="related">
			<h2>Helpful guides</h2>
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

	<section class="sibling">
		<a href="/scams">← All UK scam patterns</a>
	</section>
</article>

<style>
	.prose {
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
	.prose h1 {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: clamp(2rem, 5vw + 0.8rem, 2.8rem);
		letter-spacing: -0.02em;
		margin: 0 0 var(--space-3);
		line-height: 1.1;
	}
	.summary {
		font-size: 1.1rem;
		color: var(--ink-soft);
		max-width: 56ch;
		margin: 0 0 var(--space-6);
	}
	.advice h2,
	.related h2 {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1.3rem;
		margin: 0 0 var(--space-3);
	}
	.advice ul {
		padding-left: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		color: var(--ink-soft);
	}
	.back {
		margin-top: var(--space-7);
		padding: var(--space-4);
		background: var(--paper-2);
		border: 1px solid var(--line);
		border-radius: var(--radius);
	}
	.back p {
		margin: 0;
		color: var(--ink-soft);
	}
	.related {
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
	.sibling {
		margin-top: var(--space-5);
	}
	.sibling a {
		color: var(--ink-mute);
	}
</style>
