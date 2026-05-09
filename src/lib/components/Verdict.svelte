<script lang="ts">
	import type { ReasonSource, Verdict } from '$lib/detect/index';

	type Props = {
		verdict: Verdict;
	};

	let { verdict }: Props = $props();

	const sourceLabel: Record<ReasonSource, string> = {
		heuristic: 'our checks',
		pattern: 'UK scam patterns',
		rdap: 'RDAP registry',
		dns: 'DNS lookup',
		'safe-browsing': 'Google Safe Browsing',
		urlhaus: 'abuse.ch URLhaus',
		openphish: 'OpenPhish',
		emailrep: 'EmailRep',
		'stop-forum-spam': 'StopForumSpam',
		ipqs: 'IPQualityScore'
	};

	const checkedSources = $derived(
		verdict.sources.filter((s) => s.state === 'checked').map((s) => sourceLabel[s.name])
	);
	const skippedSources = $derived(
		verdict.sources.filter((s) => s.state === 'disabled').map((s) => sourceLabel[s.name])
	);

	function joinList(items: string[]): string {
		if (items.length <= 1) return items.join('');
		return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
	}
</script>

<section class="verdict verdict--{verdict.level} fade-in" aria-live="polite">
	<p class="kicker">Our verdict</p>
	<h2 class="headline">{verdict.headline}</h2>
	<p class="summary">{verdict.summary}</p>

	{#if verdict.normalised}
		<p class="normalised" aria-label="Checked input">
			<span>Checked:</span>
			<code>{verdict.normalised}</code>
		</p>
	{/if}

	{#if verdict.reasons.length}
		<div class="reasons">
			<p class="reasons-title">Why we think that</p>
			<ul>
				{#each verdict.reasons as reason}
					<li>
						{reason.text}
						<span class="src">via {sourceLabel[reason.source]}</span>
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	{#if verdict.advice.length}
		<div class="advice">
			<p class="advice-title">What to do</p>
			<ul>
				{#each verdict.advice as tip}
					<li>{tip}</li>
				{/each}
			</ul>
		</div>
	{/if}

	{#if checkedSources.length > 0}
		<p class="sources">
			Checked against {joinList(checkedSources)}.
			{#if skippedSources.length > 0}
				<span class="sources-skipped">Not consulted: {joinList(skippedSources)}.</span>
			{/if}
		</p>
	{:else if skippedSources.length > 0}
		<p class="sources sources-skipped">Not consulted: {joinList(skippedSources)}.</p>
	{/if}
</section>

<style>
	.verdict {
		margin-top: var(--space-5);
		padding: var(--space-6);
		border-radius: var(--radius-lg);
		background: var(--paper-2);
		border: 1px solid var(--line);
		box-shadow: var(--shadow-sm);
	}

	.verdict--safe {
		background: var(--safe-bg);
		border-color: color-mix(in srgb, var(--safe) 25%, transparent);
	}
	.verdict--caution {
		background: var(--caution-bg);
		border-color: color-mix(in srgb, var(--caution) 25%, transparent);
	}
	.verdict--suspicious {
		background: var(--suspicious-bg);
		border-color: color-mix(in srgb, var(--suspicious) 25%, transparent);
	}
	.verdict--dodgy {
		background: var(--dodgy-bg);
		border-color: color-mix(in srgb, var(--dodgy) 25%, transparent);
	}

	.kicker {
		margin: 0 0 var(--space-2);
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--ink-mute);
		font-weight: 600;
	}

	.headline {
		margin: 0;
		font-family: var(--font-display);
		font-weight: 600;
		font-size: clamp(1.85rem, 5vw + 1rem, 2.8rem);
		line-height: 1.1;
		letter-spacing: -0.02em;
	}
	.verdict--safe .headline {
		color: var(--safe);
	}
	.verdict--caution .headline {
		color: var(--caution);
	}
	.verdict--suspicious .headline {
		color: var(--suspicious);
	}
	.verdict--dodgy .headline {
		color: var(--dodgy);
	}

	.summary {
		margin: var(--space-3) 0 0;
		font-size: 1.05rem;
		color: var(--ink-soft);
	}

	.normalised {
		margin: var(--space-4) 0 0;
		padding: var(--space-2) var(--space-3);
		background: rgba(0, 0, 0, 0.04);
		border-radius: 8px;
		font-size: 0.9rem;
		color: var(--ink-soft);
		display: flex;
		gap: var(--space-2);
		align-items: baseline;
		flex-wrap: wrap;
	}
	.normalised code {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		word-break: break-all;
	}
	.normalised span {
		color: var(--ink-mute);
	}
	@media (prefers-color-scheme: dark) {
		.normalised {
			background: rgba(255, 255, 255, 0.06);
		}
	}

	.reasons,
	.advice {
		margin-top: var(--space-5);
	}
	.reasons-title,
	.advice-title {
		margin: 0 0 var(--space-2);
		font-weight: 600;
		font-size: 0.95rem;
	}
	.reasons ul,
	.advice ul {
		margin: 0;
		padding-left: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}
	.reasons li,
	.advice li {
		font-size: 0.97rem;
		color: var(--ink-soft);
	}
	.reasons .src {
		display: inline-block;
		margin-left: 0.4em;
		font-size: 0.78rem;
		color: var(--ink-mute);
		font-style: italic;
	}
	.sources {
		margin: var(--space-5) 0 0;
		font-size: 0.82rem;
		color: var(--ink-mute);
	}
	.sources-skipped {
		display: inline;
		opacity: 0.78;
	}
	p.sources-skipped {
		display: block;
	}
</style>
