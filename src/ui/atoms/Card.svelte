<script lang="ts">
	interface Props {
		isClickable?: boolean;
		style?: string;
		classes?: string;
		isNested?: boolean;
		id?: string | undefined;
		isActive?: boolean;
		ariaLabel?: string;
		onclick?: (event: MouseEvent) => void;
		children?: import('svelte').Snippet;
	}

	let {
		isClickable = false,
		style = '',
		classes = '',
		isNested = false,
		id = undefined,
		isActive = false,
		ariaLabel = '',
		onclick,
		children
	}: Props = $props();
</script>

<div
	{id}
	aria-label={ariaLabel}
	class={[
		'card',
		isClickable ? 'clickable' : null,
		'p-4',
		isNested ? 'nested' : '',
		isActive ? 'active' : '',
		classes
	]
		.filter((a) => a)
		.join(' ')}
	{style}
	role={isClickable ? 'button' : 'cell'}
	{onclick}
>
	{@render children?.()}
</div>

<style>
	.card.nested {
		background-color: var(--color-control);
		color: var(--text);
		border: 1px solid var(--color-control-border);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
	}

	.card.nested.clickable:hover {
		background-color: var(--color-control-hover);
	}

	.card {
		background-color: var(--card-background);
		color: var(--text);
		border-radius: var(--radius-surface);
	}

	.card.clickable:hover {
		background-color: var(--card-hover);
		cursor: pointer;
	}

	.card.active {
		background-color: var(--card-hover);
	}

	.card.nested.active:hover {
		background-color: var(--color-control-hover);
	}
</style>
