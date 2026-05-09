<script lang="ts">
	import JsonLd from '$lib/components/JsonLd.svelte';
	import { breadcrumbsJsonLd, OG_IMAGE } from '$lib/seo';
	import { SITE } from '$lib/site';

	let { data } = $props();
	const url = `${SITE.url}/guides`;
</script>

<svelte:head>
	<title>Scam guides for the UK | {SITE.name}</title>
	<meta
		name="description"
		content="Plain-English UK guides to spotting and avoiding scams. How to spot a phishing email, what to do if you clicked a scam link, how to report a scam in the UK and more."
	/>
	<link rel="canonical" href={url} />
	<meta property="og:title" content="Scam guides for the UK" />
	<meta property="og:description" content="Plain-English UK guides to spotting and avoiding scams." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={OG_IMAGE} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={OG_IMAGE} />
</svelte:head>

<JsonLd data={breadcrumbsJsonLd([{ name: 'Home', href: '/' }, { name: 'Guides', href: '/guides' }])} />

<article class="prose">
	<h1>Scam guides</h1>
	<p class="lede">
		Plain-English explainers on spotting scams, what to do if one catches you out, and how to keep
		family safe. Written for the UK in 2026.
	</p>

	<ul class="list">
		{#each data.guides as g}
			<li>
				<a href="/guides/{g.slug}">
					<h2>{g.title}</h2>
					<p>{g.description}</p>
				</a>
			</li>
		{/each}
	</ul>
</article>

<style>
	.prose h1 {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: clamp(2rem, 5vw + 0.8rem, 2.6rem);
		letter-spacing: -0.02em;
		margin: var(--space-5) 0 var(--space-3);
	}
	.lede {
		color: var(--ink-soft);
		max-width: 56ch;
		margin: 0 0 var(--space-5);
	}
	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}
	.list a {
		display: block;
		padding: var(--space-4);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--paper-2);
		color: var(--ink);
		text-decoration: none;
		transition: border-color 120ms ease;
	}
	.list a:hover {
		border-color: var(--ink-soft);
	}
	.list h2 {
		margin: 0 0 var(--space-2);
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1.15rem;
	}
	.list p {
		margin: 0;
		color: var(--ink-soft);
		font-size: 0.95rem;
	}
</style>
