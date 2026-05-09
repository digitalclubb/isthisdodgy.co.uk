<script lang="ts">
	import JsonLd from '$lib/components/JsonLd.svelte';
	import { breadcrumbsJsonLd, OG_IMAGE, organizationJsonLd } from '$lib/seo';
	import { SITE } from '$lib/site';
</script>

<svelte:head>
	<title>About | {SITE.name}</title>
	<meta name="description" content="How {SITE.name} works, what it checks and what it doesn't." />
	<link rel="canonical" href="{SITE.url}/about" />
	<meta property="og:title" content="About {SITE.name}" />
	<meta property="og:description" content="How {SITE.name} works, what it checks and what it doesn't." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="{SITE.url}/about" />
	<meta property="og:image" content={OG_IMAGE} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={OG_IMAGE} />
</svelte:head>

<JsonLd data={organizationJsonLd()} />
<JsonLd data={breadcrumbsJsonLd([{ name: 'Home', href: '/' }, { name: 'About', href: '/about' }])} />

<article class="prose">
	<h1>About</h1>

	<p>
		{SITE.name} is a free UK tool that checks links, emails, phone numbers and text messages for
		common scam patterns. We aim for one calm, plain-English answer. Not a 40-signal dashboard.
	</p>

	<h2>How it works</h2>
	<p>When you paste something we work out what it is and run it through:</p>
	<ul>
		<li>UK consumer-scam patterns (Royal Mail "fee", "Hi Mum", HMRC refund, bank impersonation, energy rebate, romance, crypto and more).</li>
		<li>URL heuristics. Punycode, IP-as-host, suspicious top-level domains, brand impersonation, link shorteners.</li>
		<li>Domain age via the public RDAP service. Brand-new domains are very common in scams.</li>
		<li>Live DNS lookups to see if the address actually resolves.</li>
		<li>Google Safe Browsing and abuse.ch URLhaus when an API key is configured.</li>
		<li>The OpenPhish community feed of known phishing URLs (refreshed every 12 hours).</li>
		<li>IPQualityScore fraud scores for links, emails and phone numbers when a key is configured.</li>
		<li>Phone-number checks via the open-source <a href="https://github.com/google/libphonenumber" rel="external noopener noreferrer">libphonenumber</a> library: premium-rate prefixes, line type, country.</li>
		<li>Email reputation via EmailRep and StopForumSpam.</li>
		<li>A bundled list of throwaway and disposable email providers.</li>
	</ul>

	<h2>What this is not</h2>
	<p>
		It's not antivirus software. It can't tell you whether a link will install malware or whether a
		caller is who they say they are. It's a fast first-look tool. Anything important (a payment, a
		login, a transfer) should be verified directly with the company, using contact details from
		their official website.
	</p>

	<h2>About phone-number reports</h2>
	<p>
		Crowd-sourced "people have reported this number as a scam" data is not freely available.
		Tellows, Truecaller and Hiya all gate that data behind enterprise contracts. The closest
		freely-available approximation is IPQualityScore's abuse-network score, which is what we use
		when an IPQS key is configured. If you want full crowd-sourced reports for a specific number,
		sites like whocallsme.com and tellows.co.uk are worth a look.
	</p>

	<h2>Hedging on purpose</h2>
	<p>
		We use words like "likely", "looks like" and "we can't confirm" deliberately. A tool that
		claims certainty it doesn't have causes more harm than help.
	</p>

	<h2>Where to report</h2>
	<ul>
		<li>Forward suspicious texts to <strong>7726</strong> (free, spells SPAM).</li>
		<li>Report fraud to Action Fraud at <a href="https://www.actionfraud.police.uk" rel="external noopener noreferrer">actionfraud.police.uk</a> or call 0300 123 2040.</li>
		<li>For HMRC scam emails: <a href="mailto:phishing@hmrc.gov.uk">phishing@hmrc.gov.uk</a>.</li>
		<li>For Royal Mail scam emails: <a href="mailto:reportascam@royalmail.com">reportascam@royalmail.com</a>.</li>
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
