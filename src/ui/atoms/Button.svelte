<script lang="ts">
	interface Props {
		variant?: 'accent' | 'primary' | 'secondary' | 'default';
		isNested?: boolean;
		isDisabled?: boolean;
		active?: boolean;
		label?: string;
		classes?: string;
		style?: string;
		type?: 'submit' | 'reset' | 'button';
		onclick?: (event: MouseEvent) => void;
		children?: import('svelte').Snippet;
		[key: string]: any;
	}

	let {
		variant = 'default',
		isNested = false,
		isDisabled = false,
		active = false,
		label = '',
		classes = '',
		style = '',
		type = 'button',
		onclick,
		children,
		...rest
	}: Props = $props();
</script>

<button
	{type}
	class={`button ${variant} rounded-lg p-4 ${isNested ? 'nested' : ''} ${
		active ? 'active' : ''
	} ${classes}`}
	{style}
	disabled={isDisabled}
	{onclick}
	{...rest}
>
	{label}
	{@render children?.()}
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

	.button.primary,
	.button.default {
		border: 1px solid var(--color-control-border);
		color: var(--text);
	}

	.button:focus-visible {
		outline: 2px solid var(--red-accent);
		outline-offset: 3px;
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
		background-color: var(--color-control);
	}

	.button.primary.nested {
		background-color: var(--color-control);
	}

	.button.primary.nested:hover,
	.button.primary.nested:active,
	.button.primary.nested.active {
		background-color: var(--color-control-hover);
	}

	.button.primary:hover,
	.button.primary:active,
	.button.primary.active {
		background-color: var(--color-control-hover);
	}

	.button.primary:disabled {
		background-color: var(--color-control-hover);
		color: var(--text);
	}

	.button.default {
		background-color: var(--color-control);
	}

	.button.default:hover {
		background-color: var(--color-control-hover);
	}

	.button.default:disabled {
		background-color: var(--color-control-hover);
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
		background-color: var(--color-control-hover);
	}

	.button.secondary:disabled {
		background-color: var(--color-control);
		color: var(--text-inverse);
	}

	.button.default.nested:hover {
		background-color: var(--color-control-hover);
	}
</style>
