<script lang="ts">
	import JsonLd from '$lib/components/JsonLd.svelte';
	import { breadcrumbsJsonLd, OG_IMAGE } from '$lib/seo';
	import { SITE } from '$lib/site';

	let { data } = $props();
</script>

<svelte:head>
	<title>Common UK scams | {SITE.name}</title>
	<meta
		name="description"
		content="The most common UK consumer scams right now. Royal Mail fee texts, 'Hi Mum' WhatsApp messages, HMRC refunds, bank impersonation and more."
	/>
	<link rel="canonical" href="{SITE.url}/scams" />
	<meta property="og:title" content="Common UK scams" />
	<meta property="og:description" content="The most common UK consumer scams right now." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="{SITE.url}/scams" />
	<meta property="og:image" content={OG_IMAGE} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={OG_IMAGE} />
</svelte:head>

<JsonLd data={breadcrumbsJsonLd([{ name: 'Home', href: '/' }, { name: 'Common UK scams', href: '/scams' }])} />

<article class="prose">
	<h1>Common UK scams</h1>
	<p class="lede">
		If a message you've received looks like one of these, treat it as dodgy until proven otherwise.
	</p>

	<ul class="patterns">
		{#each data.patterns as p}
			<li>
				<a href="/scams/{p.slug}">
					<h2>{p.name}</h2>
					<p>{p.summary}</p>
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
		margin: 0 0 var(--space-5);
		max-width: 56ch;
	}
	.patterns {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}
	.patterns a {
		display: block;
		padding: var(--space-4);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--paper-2);
		color: var(--ink);
		text-decoration: none;
		transition: border-color 120ms ease;
	}
	.patterns a:hover {
		border-color: var(--ink-soft);
	}
	.patterns h2 {
		margin: 0 0 var(--space-2);
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1.15rem;
	}
	.patterns p {
		margin: 0;
		color: var(--ink-soft);
		font-size: 0.95rem;
	}
</style>
