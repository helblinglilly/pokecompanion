<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let isClickable: boolean = false;
	export let style: string = '';
	export let classes: string = '';
	export let isNested: boolean = false;

	const dispatch = createEventDispatcher();
</script>

<div
	class={[
		'card',
		isClickable ? 'clickable' : null,
		'p-4',
		isNested ? 'nested dark:bg-red-300' : '',
		classes
	]
		.filter((a) => a)
		.join(' ')}
	{style}
	role={isClickable ? 'button' : 'cell'}
	on:click={() => {
		dispatch('click');
	}}
>
	<slot />
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
</style>
