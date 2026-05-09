<script lang="ts">
	import type { GuideBlock } from '$lib/guides/types';

	type Props = { block: GuideBlock };
	let { block }: Props = $props();
</script>

{#if block.type === 'p'}
	<p>{@html block.html}</p>
{:else if block.type === 'ul'}
	<ul>
		{#each block.items as item}
			<li>{@html item}</li>
		{/each}
	</ul>
{:else if block.type === 'ol'}
	<ol>
		{#each block.items as item}
			<li>{@html item}</li>
		{/each}
	</ol>
{:else if block.type === 'callout'}
	<aside class="callout callout--{block.tone}">{@html block.html}</aside>
{:else if block.type === 'h3'}
	<h3>{block.text}</h3>
{/if}

<style>
	p {
		margin: 0 0 var(--space-3);
		color: var(--ink-soft);
	}
	ul,
	ol {
		margin: 0 0 var(--space-4);
		padding-left: var(--space-4);
		color: var(--ink-soft);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}
	p :global(code),
	li :global(code) {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.9em;
		background: var(--paper-2);
		padding: 0.05em 0.35em;
		border-radius: 4px;
	}
	h3 {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1.1rem;
		margin: var(--space-5) 0 var(--space-2);
		letter-spacing: -0.01em;
	}
	.callout {
		margin: var(--space-4) 0;
		padding: var(--space-3) var(--space-4);
		border-radius: var(--radius);
		border-left: 3px solid var(--ink-mute);
		background: var(--paper-2);
		color: var(--ink-soft);
		font-size: 0.97rem;
	}
	.callout--note {
		border-left-color: var(--accent);
	}
	.callout--warn {
		border-left-color: var(--suspicious);
	}
</style>
