<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import FiveHundred from './Generic/FiveHundred.svelte';
	import FourOhFour from './Generic/FourOhFour.svelte';
	import FiveTwoThree from './Generic/FiveTwoThree.svelte';
	import Pokemon404 from './Pokemon/Pokemon404.svelte';
	import { Logger } from '$lib/log';

	onMount(async () => {
		if (![404, 523].includes($page.status)) {
			await Logger.addPageAction('ErrorBoundary', 'Generic', {
				error: $page.error?.message
			});
		}
	});
</script>

<div id="errorHeader">
	{#if $page.status === 404 && $page.route.id?.startsWith('/pokemon/')}
		<Pokemon404 />
	{:else if $page.status === 404}
		<FourOhFour />
	{:else if $page.status === 523}
		<FiveTwoThree />
	{:else}
		<FiveHundred />
	{/if}
</div>

<style>
	#errorHeader {
		display: grid;
		text-align: center;
	}
</style>
