<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let isClickable: boolean = false;
	export let style: string = '';
	export let classes: string = '';
	export let isNested: boolean = false;

	const dispatch = createEventDispatcher();
</script>

<div
	class={['card', isClickable ? 'clickable' : null, 'p-4', isNested ? 'nested' : '', classes]
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
	.card {
		background-color: var(--card-background);
		color: var(--text);
		border-radius: 0.5rem;
	}

	.card.clickable:hover {
		background-color: var(--card-hover);
		cursor: pointer;
	}

	.card.nested {
		background-color: var(--card-hover);
		color: var(--text-inverse);
	}
</style>
