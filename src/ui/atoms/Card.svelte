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
		isNested ? 'nested dark:bg-red-300' : '',
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
		background-color: var(--grey-primary);
		color: var(--text-light);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	:global(.dark-theme) .card.nested {
		background-color: var(--grey-primary-dark);
		color: var(--text-light);
	}

	.card.nested:hover {
		background-color: var(--grey-muted);
	}

	.card {
		background-color: var(--card-background);
		color: var(--text);
		border-radius: 0.5rem;
	}

	.card.clickable:hover {
		background-color: var(--card-hover);
		cursor: pointer;
	}

	.card.active {
		background-color: var(--card-hover);
	}

	.card.nested.active:hover {
		background-color: var(--grey-muted);
	}
</style>
