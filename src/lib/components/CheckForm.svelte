<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { untrack } from 'svelte';

	type Props = {
		busy?: boolean;
		seed?: string;
	};

	let { busy = $bindable(false), seed = '' }: Props = $props();
	// Seed only at mount. The form is the source of truth after that.
	let value = $state(untrack(() => seed));

	const submit: SubmitFunction = () => {
		busy = true;
		return async ({ update }) => {
			await update({ reset: false });
			busy = false;
		};
	};
</script>

<form method="POST" use:enhance={submit} aria-label="Check something">
	<label for="input" class="visually-hidden">Paste a link, email, phone number or message</label>
	<textarea
		id="input"
		name="input"
		bind:value
		rows="3"
		spellcheck="false"
		autocomplete="off"
		autocapitalize="off"
		placeholder="Paste a link, email, phone number or message…"
		required
		minlength="3"
		maxlength="4000"
	></textarea>

	<div class="row">
		<button type="submit" disabled={busy}>
			{busy ? 'Checking…' : 'Check it'}
		</button>
		<p class="privacy">We don't save what you paste.</p>
	</div>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	textarea {
		width: 100%;
		padding: var(--space-4);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--paper-2);
		color: var(--ink);
		font: inherit;
		font-size: 1.05rem;
		resize: vertical;
		min-height: 96px;
		transition: border-color 120ms ease;
	}
	textarea:focus {
		outline: none;
		border-color: var(--ink);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--ink) 18%, transparent);
	}

	.row {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		flex-wrap: wrap;
	}

	button {
		appearance: none;
		border: 0;
		background: var(--ink);
		color: var(--paper);
		padding: var(--space-3) var(--space-5);
		border-radius: var(--radius);
		font-weight: 600;
		font-size: 1rem;
		min-height: 48px;
		min-width: 140px;
		transition:
			transform 80ms ease,
			background 120ms ease;
	}
	button:hover:not(:disabled) {
		background: color-mix(in srgb, var(--ink) 88%, var(--accent) 12%);
	}
	button:active:not(:disabled) {
		transform: translateY(1px);
	}
	button:disabled {
		opacity: 0.6;
		cursor: progress;
	}

	.privacy {
		margin: 0;
		color: var(--ink-mute);
		font-size: 0.88rem;
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}
</style>
