<script lang="ts">
	import JsonLd from '$lib/components/JsonLd.svelte';
	import Verdict from '$lib/components/Verdict.svelte';
	import { breadcrumbsJsonLd, OG_IMAGE } from '$lib/seo';
	import { SITE } from '$lib/site';

	let { data } = $props();
	const url = $derived(`${SITE.url}/url/${data.domain}`);
	const title = $derived(`Is ${data.domain} a scam? | ${SITE.name}`);
	const description = $derived(
		`Quick scam check for ${data.domain}. Plain-English verdict. No signup. No ads.`
	);
	const breadcrumbs = $derived(
		breadcrumbsJsonLd([
			{ name: 'Home', href: '/' },
			{ name: `Is ${data.domain} a scam?`, href: `/url/${data.domain}` }
		])
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={OG_IMAGE} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={OG_IMAGE} />
	<meta name="robots" content="index,follow" />
</svelte:head>

<JsonLd data={breadcrumbs} />

<article>
	<p class="kicker">Quick check</p>
	<h1>Is <span class="domain">{data.domain}</span> a scam?</h1>

	<Verdict verdict={data.verdict} />

	<aside class="cta">
		<p>
			Want to check a different link, email, message or phone number?
			<a href="/">Use the checker on the home page.</a>
		</p>
	</aside>

	<section class="caveats">
		<h2>How we worked this out</h2>
		<p>
			This verdict combines structural checks on the address, a domain-age lookup via the public
			RDAP registry, a live DNS check and (when configured) cross-references against Google Safe
			Browsing, abuse.ch URLhaus and the OpenPhish community feed. We don't visit the site and
			we can't tell you what its content is doing right now.
		</p>
		<p>
			If you're about to log in, pay or share personal details, double-check by going to the
			brand's official website directly. Type it in by hand. Don't click the link.
		</p>
	</section>
</article>

<style>
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
		font-size: clamp(2rem, 5vw + 0.8rem, 2.6rem);
		letter-spacing: -0.02em;
		margin: 0 0 var(--space-3);
		line-height: 1.1;
		word-break: break-word;
	}
	.domain {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.8em;
		background: var(--paper-2);
		border: 1px solid var(--line);
		padding: 0 0.4em;
		border-radius: 8px;
	}
	.cta {
		margin-top: var(--space-6);
		padding: var(--space-4);
		background: var(--paper-2);
		border: 1px solid var(--line);
		border-radius: var(--radius);
	}
	.cta p {
		margin: 0;
		color: var(--ink-soft);
	}
	.caveats {
		margin-top: var(--space-7);
		max-width: 64ch;
	}
	.caveats h2 {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1.2rem;
		margin: 0 0 var(--space-3);
	}
	.caveats p {
		margin: 0 0 var(--space-3);
		color: var(--ink-soft);
	}
</style>
