<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let variant: 'accent' | 'primary' | 'secondary' | 'default' = 'default';
	export let isNested: boolean = false;
	export let isDisabled: boolean = false;
	export let active: boolean = false;
	export let label: string = '';
	export let classes: string = '';
	export let style: string = '';
	export let type: 'submit' | 'reset' | 'button' = 'button';

	const dispatch = createEventDispatcher();
</script>

<button
	{type}
	class={`button ${variant} rounded-lg p-4 ${isNested ? 'nested' : ''} ${
		active ? 'active' : ''
	} ${classes}`}
	{style}
	disabled={isDisabled}
	{...$$restProps}
	on:click={() => {
		dispatch('click');
	}}
>
	{label}
	<slot />
</button>

<style>
	.button {
		border: none;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		word-wrap: break-word;
		align-items: center;
		display: flex;
		justify-content: center;
	}

	.button:hover {
		cursor: pointer;
	}

	.button:disabled {
		cursor: not-allowed;
	}

	.button.accent {
		color: var(--text-inverse-light);
		background-color: var(--red-accent);
	}

	.button.accent:hover,
	.button.accent:active,
	.button.accent.active {
		background-color: var(--red-accent-muted);
	}

	.button.accent:disabled {
		background-color: var(--red-accent-darker);
	}

	.button.primary {
		background-color: var(--grey-primary);
	}

	.button.primary.nested {
		background-color: var(--select-background);
	}

	.button.primary.nested:hover,
	.button.primary.nested:active,
	.button.primary.nested.active {
		background-color: var(--card-hover);
	}

	.button.primary:hover,
	.button.primary:active,
	.button.primary.active {
		background-color: var(--grey-muted);
	}

	.button.primary:disabled {
		background-color: var(--grey-muted);
		color: var(--text);
	}

	.button.default {
		background-color: var(--grey-primary);
	}

	.button.default:hover {
		background-color: var(--grey-muted);
	}

	.button.default:disabled {
		background-color: var(--grey-muted);
		color: var(--text);
	}

	.button.secondary {
		background-color: var(--site-background);
		box-shadow: none;
		border: 1px solid var(--text);
		color: var(--text);
		margin: -1px;
	}

	.button.secondary:hover {
		background-color: var(--grey-muted);
	}

	.button.secondary:disabled {
		background-color: var(--grey-primary);
		color: var(--text-inverse);
	}

	:global(.dark-theme) .button.default.nested {
		background-color: var(--text-light);
	}

	.button.default.nested:hover {
		background-color: var(--card-hover);
	}
</style>
