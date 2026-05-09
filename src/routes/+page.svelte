<script lang="ts">
	import { page } from '$app/state';
	import CheckForm from '$lib/components/CheckForm.svelte';
	import JsonLd from '$lib/components/JsonLd.svelte';
	import Verdict from '$lib/components/Verdict.svelte';
	import { OG_IMAGE, organizationJsonLd, websiteJsonLd } from '$lib/seo';
	import { SITE } from '$lib/site';

	let { form } = $props();
	let busy = $state(false);

	// Support ?q=... so the SearchAction structured data on the home page
	// actually has somewhere to deep-link to. Pre-fills the textarea.
	const seedFromQuery = $derived(page.url.searchParams.get('q') ?? '');

	const examples = [
		{
			label: 'Royal Mail "fee" text',
			value:
				'Royal Mail: your parcel could not be delivered due to a £1.45 unpaid fee. Reschedule: https://royal-mail-redelivery.top/uk'
		},
		{ label: 'Suspicious URL', value: 'http://hmrc-refund-portal.xyz/login' },
		{ label: 'UK number', value: '+44 7700 900123' },
		{
			label: 'Hi Mum WhatsApp',
			value:
				"Hi Mum, dropped my phone and using a new number. Can you send £450 for a bill? I'll pay you back tomorrow."
		}
	];

	function fillExample(value: string) {
		const el = document.getElementById('input') as HTMLTextAreaElement | null;
		if (!el) return;
		el.value = value;
		el.focus();
		el.dispatchEvent(new Event('input', { bubbles: true }));
	}
</script>

<svelte:head>
	<title>{SITE.name}: is this link, email or message a scam?</title>
	<meta name="description" content={SITE.description} />
	<link rel="canonical" href={SITE.url} />
	<meta property="og:title" content={SITE.name} />
	<meta property="og:description" content={SITE.tagline} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={SITE.url} />
	<meta property="og:image" content={OG_IMAGE} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={OG_IMAGE} />
</svelte:head>

<JsonLd data={websiteJsonLd()} />
<JsonLd data={organizationJsonLd()} />

<section class="hero">
	<h1>Is this dodgy?</h1>
	<p class="lede">
		Paste a link, email, phone number or message. We'll tell you, in plain English, whether it
		looks like a scam.
	</p>
</section>

<!-- {#key} re-mounts the form when the ?q= query param changes during client-side
	navigation, so the textarea always reflects the current seed. -->
{#key seedFromQuery}
	<CheckForm bind:busy seed={seedFromQuery} />
{/key}

{#if form?.error}
	<p class="error" role="alert">{form.error}</p>
{/if}

{#if form?.verdict}
	<Verdict verdict={form.verdict} />
{/if}

{#if !form?.verdict}
	<section class="examples" aria-label="Try one of these">
		<p class="examples-title">Or try one of these:</p>
		<ul>
			{#each examples as ex}
				<li>
					<button type="button" onclick={() => fillExample(ex.value)}>{ex.label}</button>
				</li>
			{/each}
		</ul>
	</section>

	<section class="explainer">
		<h2>What we check</h2>
		<div class="cards">
			<article>
				<h3>Links</h3>
				<p>Brand impersonation, dodgy endings, hidden redirects. Plus domain age, DNS lookups and known phishing feeds.</p>
			</article>
			<article>
				<h3>Phone numbers</h3>
				<p>UK premium-rate prefixes, international spoofing and other flags worth a second look.</p>
			</article>
			<article>
				<h3>Emails</h3>
				<p>Throwaway providers, branded look-alikes and community spam reports from public databases.</p>
			</article>
			<article>
				<h3>Messages</h3>
				<p>UK scam patterns: Royal Mail "fee", "Hi Mum", HMRC refund, bank impersonation and more.</p>
			</article>
		</div>
	</section>

	<section class="trust">
		<p>
			Always free. No signup. We don't save what you paste. If something looks dodgy you can
			<a href="/report">report it</a>. Forward suspicious texts to <strong>7726</strong> (free).
			Read our <a href="/guides">scam guides</a> or browse <a href="/scams">common UK scams</a> to learn the patterns.
		</p>
	</section>
{/if}

<style>
	.hero h1 {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: clamp(2.4rem, 7vw + 1rem, 3.6rem);
		letter-spacing: -0.025em;
		line-height: 1;
		margin: var(--space-5) 0 var(--space-3);
	}
	.lede {
		font-size: 1.1rem;
		color: var(--ink-soft);
		margin: 0 0 var(--space-5);
		max-width: 38ch;
	}

	.error {
		margin-top: var(--space-3);
		color: var(--dodgy);
		font-size: 0.95rem;
	}

	.examples {
		margin-top: var(--space-6);
	}
	.examples-title {
		margin: 0 0 var(--space-3);
		font-size: 0.9rem;
		color: var(--ink-mute);
	}
	.examples ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
	}
	.examples button {
		appearance: none;
		border: 1px solid var(--line);
		background: transparent;
		color: var(--ink-soft);
		padding: var(--space-2) var(--space-3);
		border-radius: 999px;
		font-size: 0.88rem;
		transition: border-color 120ms ease;
	}
	.examples button:hover {
		border-color: var(--ink-soft);
		color: var(--ink);
	}

	.explainer {
		margin-top: var(--space-7);
	}
	.explainer h2 {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1.35rem;
		margin: 0 0 var(--space-4);
		letter-spacing: -0.01em;
	}
	.cards {
		display: grid;
		gap: var(--space-3);
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	}
	.cards article {
		padding: var(--space-4);
		border-radius: var(--radius);
		background: var(--paper-2);
		border: 1px solid var(--line);
	}
	.cards h3 {
		margin: 0 0 var(--space-2);
		font-size: 1rem;
	}
	.cards p {
		margin: 0;
		color: var(--ink-soft);
		font-size: 0.92rem;
	}

	.trust {
		margin-top: var(--space-7);
		padding: var(--space-5);
		border-radius: var(--radius);
		background: var(--paper-2);
		border: 1px solid var(--line);
		color: var(--ink-soft);
		font-size: 0.95rem;
	}
	.trust p {
		margin: 0;
	}
</style>
