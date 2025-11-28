<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { Logger } from '$lib/log';
	import FiveHundred from '$lib/components/ErrorPages/Generic/FiveHundred.svelte';
	import FiveTwoThree from '$lib/components/ErrorPages/Generic/FiveTwoThree.svelte';
	import FourOhFour from '$lib/components/ErrorPages/Generic/FourOhFour.svelte';
	import Pokemon404 from '$/lib/components/ErrorPages/Pokemon404.svelte';

	onMount(async () => {
		if (![404, 523].includes($page.status)) {
			await Logger.addPageAction('ErrorBoundary', {
				kind: '500'
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
