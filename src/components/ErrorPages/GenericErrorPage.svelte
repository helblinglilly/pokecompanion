<script>
	import { page } from '$app/stores';
	import { logError } from '$lib/log';
	import { onMount } from 'svelte';
	import FiveHundred from './Generic/FiveHundred.svelte';
	import FourOhFour from './Generic/FourOhFour.svelte';
	import FiveTwoThree from './Generic/FiveTwoThree.svelte';
	import Pokemon404 from './Pokemon/Pokemon404.svelte';

	onMount(() => {
		logError('User reached error boundary', 'ErrorBoundary', {
			...$page,
			data: null
		});
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
