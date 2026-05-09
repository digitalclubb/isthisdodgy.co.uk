<script lang="ts">
	import JsonLd from '$lib/components/JsonLd.svelte';
	import { breadcrumbsJsonLd, OG_IMAGE } from '$lib/seo';
	import { SITE } from '$lib/site';
</script>

<svelte:head>
	<title>Report a scam | {SITE.name}</title>
	<meta
		name="description"
		content="The fastest UK routes to report scam texts, emails, phone calls and websites."
	/>
	<link rel="canonical" href="{SITE.url}/report" />
	<meta property="og:title" content="Report a scam | {SITE.name}" />
	<meta property="og:description" content="The fastest UK routes to report scam texts, emails, phone calls and websites." />
	<meta property="og:url" content="{SITE.url}/report" />
	<meta property="og:image" content={OG_IMAGE} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={OG_IMAGE} />
</svelte:head>

<JsonLd data={breadcrumbsJsonLd([{ name: 'Home', href: '/' }, { name: 'Report a scam', href: '/report' }])} />

<article class="prose">
	<h1>Report a scam</h1>
	<p>If you've been targeted, here's where to send it. All free.</p>

	<h2>Suspicious text messages</h2>
	<p>
		Forward the text to <strong>7726</strong> (the keys spell <em>SPAM</em>). It's free and goes
		straight to your mobile network's abuse team.
	</p>

	<h2>Suspicious emails</h2>
	<ul>
		<li>UK general phishing reports: <a href="mailto:report@phishing.gov.uk">report@phishing.gov.uk</a></li>
		<li>HMRC scams: <a href="mailto:phishing@hmrc.gov.uk">phishing@hmrc.gov.uk</a></li>
		<li>Royal Mail scams: <a href="mailto:reportascam@royalmail.com">reportascam@royalmail.com</a></li>
		<li>TV Licensing scams: <a href="mailto:phishing@tvlicensing.co.uk">phishing@tvlicensing.co.uk</a></li>
	</ul>

	<h2>Scam websites</h2>
	<p>
		Report fake or fraudulent websites to the National Cyber Security Centre at
		<a href="https://www.ncsc.gov.uk/section/about-this-website/report-scam-website" rel="external noopener noreferrer">ncsc.gov.uk</a>.
	</p>

	<h2>Scam phone calls</h2>
	<p>
		Report nuisance and scam calls to the <a href="https://ico.org.uk/make-a-complaint/nuisance-calls-and-messages/" rel="external noopener noreferrer">Information Commissioner's Office</a>.
		For UK numbered scams reported by the public, <a href="https://www.tellows.co.uk" rel="external noopener noreferrer">tellows.co.uk</a> and <a href="https://whocallsme.com" rel="external noopener noreferrer">whocallsme.com</a> are useful community sites.
	</p>

	<h2>Money lost or fraud attempted</h2>
	<p>
		<strong>Action Fraud</strong> for England, Wales and Northern Ireland:
		<a href="https://www.actionfraud.police.uk" rel="external noopener noreferrer">actionfraud.police.uk</a> or 0300 123
		2040.<br />
		<strong>Police Scotland</strong>: call 101.
	</p>

	<h2>Bank-related fraud</h2>
	<p>
		Call your bank using the number on the back of your card. Most UK banks also accept reports via
		the in-app chat.
	</p>

	<h2>If you've shared a password or code</h2>
	<ul>
		<li>Change the password immediately, including on any other site that uses it.</li>
		<li>Turn on two-factor authentication.</li>
		<li>If you shared a banking code, call your bank now.</li>
	</ul>
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
