<script lang="ts">
	import JsonLd from '$lib/components/JsonLd.svelte';
	import Verdict from '$lib/components/Verdict.svelte';
	import { breadcrumbsJsonLd, OG_IMAGE } from '$lib/seo';
	import { SITE } from '$lib/site';

	let { data } = $props();
	const display = $derived(data.verdict.normalised ?? data.raw);
	// data.slug is the original encoded path segment from the route params,
	// so the canonical we emit matches the URL the request arrived at.
	const slug = $derived(data.slug);
	const url = $derived(`${SITE.url}/number/${slug}`);
	const title = $derived(`Who called from ${display}? | ${SITE.name}`);
	const description = $derived(
		`Quick check on ${display}. UK premium-rate, international or standard line. Plain-English answer.`
	);
	const breadcrumbs = $derived(
		breadcrumbsJsonLd([
			{ name: 'Home', href: '/' },
			{ name: `Who called from ${display}?`, href: `/number/${slug}` }
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
</svelte:head>

<JsonLd data={breadcrumbs} />

<article>
	<p class="kicker">Quick check</p>
	<h1>Who called from <span class="num">{display}</span>?</h1>

	<Verdict verdict={data.verdict} />

	<aside class="cta">
		<p>
			Got a text from this number?
			<a href="/">Paste the message on the home page</a> for a deeper check.
		</p>
	</aside>

	<section class="caveats">
		<h2>How we worked this out</h2>
		<p>
			We classify the number by its country and prefix using the open-source libphonenumber
			library. We can flag premium-rate ranges and obvious foreign spoofs but we can't tell you
			who specifically called. Number-spoofing means even a "real" number on caller ID can be
			fake.
		</p>
		<p>
			Crowd-sourced "people have reported this number" data isn't freely available. The closest
			free signal is IPQualityScore's abuse-network score, which we use when configured. For
			full community reports, <a href="https://www.tellows.co.uk" rel="external noopener noreferrer">tellows.co.uk</a> and <a href="https://whocallsme.com" rel="external noopener noreferrer">whocallsme.com</a> are worth a look.
		</p>
		<p>
			If you missed a call from a UK 09 or 070 number, don't ring back blind. Those are the most
			common premium-rate traps.
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
		font-size: clamp(1.8rem, 5vw + 0.5rem, 2.6rem);
		letter-spacing: -0.02em;
		margin: 0 0 var(--space-3);
		line-height: 1.1;
		word-break: break-word;
	}
	.num {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.85em;
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
