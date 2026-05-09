<script lang="ts">
	type Props = {
		data: unknown;
	};
	let { data }: Props = $props();

	// Escape sequences that could break out of the inline <script> tag or
	// confuse HTML / JSON parsers. Standard `serialize-javascript` style
	// hardening. Inputs come from controlled sources today, but doing this
	// once at the helper means future callers can't accidentally introduce
	// an XSS hole.
	const LINE_SEP_RE = new RegExp('\\u2028', 'g');
	const PARA_SEP_RE = new RegExp('\\u2029', 'g');

	function safeJson(input: unknown): string {
		return JSON.stringify(input)
			.replace(/</g, '\\u003c')
			.replace(/-->/g, '--\\u003e')
			.replace(LINE_SEP_RE, '\\u2028')
			.replace(PARA_SEP_RE, '\\u2029');
	}

	const json = $derived(safeJson(data));
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${json}</script>`}
</svelte:head>
