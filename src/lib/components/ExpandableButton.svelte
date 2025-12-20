<script lang="ts">
	import Button from '$/ui/atoms/button/Button.svelte';
	// import { navigating } from '$app/stores';
	import type { Snippet } from 'svelte';

	interface Props {
		title?: Snippet;
		content?: Snippet;
		onclick?: () => void;
		[key: string]: any;
	}

	let { title, content, onclick, ...rest }: Props = $props();

	let isExpanded = $state(false);

	// $effect(() => {
	// 	const unsubscribe = navigating.subscribe(() => {
	// 		isExpanded = false;
	// 	});

	// 	return unsubscribe;
	// });

	function handleClick() {
	console.log('clicked');
		isExpanded = !isExpanded;
		onclick?.();
	}
</script>

<Button
	variant="primary"
	isNested
	classes="w-full"
	style="height: 3rem;"
	onclick={handleClick}
	{...rest}
>
	{@render title?.()}
</Button>

{#if isExpanded}
	{@render content?.()}
{/if}
