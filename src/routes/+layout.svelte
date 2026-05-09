<script lang="ts">
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	import { onMount } from 'svelte';
	import { SITE } from '$lib/site';
	import '../app.css';

	let { children } = $props();

	onMount(() => {
		// Vercel Analytics is privacy-friendly: no cookies, no fingerprinting,
		// no PII. We only enable in production so dev clicks don't pollute the
		// dashboard.
		if (!dev) inject({ mode: 'production' });
	});
</script>

<svelte:head>
	<meta name="application-name" content={SITE.name} />
</svelte:head>

<a class="skip" href="#main">Skip to content</a>

<header class="site">
	<a class="brand" href="/" aria-label="{SITE.name} home">
		<span class="brand-mark" aria-hidden="true">?</span>
		<span class="brand-name">isthisdodgy<span class="brand-tld">.co.uk</span></span>
	</a>
</header>

<main id="main">
	{@render children()}
</main>

<footer class="site">
	<nav aria-label="Footer">
		<a href="/guides">Guides</a>
		<a href="/scams">UK scams</a>
		<a href="/about">About</a>
		<a href="/privacy">Privacy</a>
		<a href="/report">Report a scam</a>
	</nav>
	<p class="disclaimer">
		Helpful guidance, not legal or security advice. Always verify with the official source.
	</p>
</footer>
