<script lang="ts">
	import JsonLd from '$lib/components/JsonLd.svelte';
	import { breadcrumbsJsonLd, OG_IMAGE } from '$lib/seo';
	import { SITE } from '$lib/site';
</script>

<svelte:head>
	<title>Privacy | {SITE.name}</title>
	<meta name="description" content="What {SITE.name} stores about your checks (almost nothing) and why." />
	<link rel="canonical" href="{SITE.url}/privacy" />
	<meta property="og:title" content="Privacy | {SITE.name}" />
	<meta property="og:description" content="What we store about your checks (almost nothing) and why." />
	<meta property="og:url" content="{SITE.url}/privacy" />
	<meta property="og:image" content={OG_IMAGE} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={OG_IMAGE} />
</svelte:head>

<JsonLd data={breadcrumbsJsonLd([{ name: 'Home', href: '/' }, { name: 'Privacy', href: '/privacy' }])} />

<article class="prose">
	<h1>Privacy</h1>

	<p>
		People paste sensitive things into a scam-checker. Text from family members, bank messages,
		personal phone numbers. We treat that as a trust we can't break.
	</p>

	<h2>What we don't do</h2>
	<ul>
		<li>We don't save what you paste. There's no database of your checks.</li>
		<li>We don't show ads.</li>
		<li>We don't sell or share your data.</li>
		<li>We don't ask for your email, name or any signup.</li>
	</ul>

	<h2>What we do</h2>
	<ul>
		<li>Your input is processed in memory on a server. The verdict is sent back to your browser. The input is then discarded.</li>
		<li>
			When you check a link, email or phone number we may pass it to one of these services to
			enrich the verdict: Google Safe Browsing, abuse.ch URLhaus, OpenPhish, the public RDAP
			registry, EmailRep, StopForumSpam and IPQualityScore. Each call is anonymous and is only
			made to that one service. These services run their own logs of incoming requests. We
			can't control that. If your input is highly sensitive, edit out personal details before
			pasting.
		</li>
		<li>
			Standard, anonymous, low-cardinality server logs (date, route hit, response code) may be
			kept by our hosting provider for security and abuse prevention. They don't contain what you
			pasted.
		</li>
		<li>
			We use <a href="https://vercel.com/docs/analytics" rel="external noopener noreferrer">Vercel Analytics</a> to count page views. It's privacy-friendly: no cookies, no
			fingerprinting, no PII. Vercel records aggregated counts plus the country a request came
			from, derived from the IP. The IP itself is not stored.
		</li>
	</ul>

	<h2>If we add another external check</h2>
	<p>
		We'll list it here before turning it on. We won't quietly start sharing input with new third
		parties.
	</p>

	<h2>Contact</h2>
	<p>Questions or corrections: open an issue or use the <a href="/report">report page</a>.</p>
</article>

<style>
	.prose {
		max-width: 64ch;
	}
	.prose h1 {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: clamp(2rem, 5vw + 0.8rem, 2.6rem);
		letter-spacing: -0.02em;
		margin: var(--space-5) 0 var(--space-4);
	}
	.prose h2 {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1.35rem;
		margin: var(--space-6) 0 var(--space-3);
	}
	.prose p {
		color: var(--ink-soft);
		margin: 0 0 var(--space-3);
	}
	.prose ul {
		color: var(--ink-soft);
		padding-left: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}
</style>
