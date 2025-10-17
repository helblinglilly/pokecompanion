<script lang="ts">
	import Button from '$/ui/atoms/button/Button.svelte';
	import { navigating } from '$app/stores';
	import { createEventDispatcher } from 'svelte';

	let isExpanded = false;

	const dispatch = createEventDispatcher();

	navigating.subscribe(() => {
		isExpanded = false;
	});
</script>

<Button
	variant="primary"
	isNested
	classes="w-full contents"
	style="height: 3rem;"
	on:click={() => {
		isExpanded = !isExpanded;
		dispatch('click');
	}}
	{...$$restProps}
>
	<slot name="title" />
</Button>

{#if isExpanded}
	<slot name="content" />
{/if}
