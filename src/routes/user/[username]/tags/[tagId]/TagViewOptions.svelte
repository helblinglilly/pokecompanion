<script lang="ts">
	import Icon from '$/ui/atoms/Icon.svelte';
	import Button from '$/ui/atoms/Button.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	function replaceQueryParam(name: string, value: string) {
		const newSearchParams = new URLSearchParams(page.url.searchParams);
		newSearchParams.set(name, value);
		goto(`?${newSearchParams}`, { replaceState: true, noScroll: true });
	}
</script>

<Button
	onclick={() => {
		const newViewState = page.url.searchParams.get('view') === 'card' ? 'list' : 'card';
		replaceQueryParam('view', newViewState);
	}}
	classes="inline-flex align-middle gap-2 w-56 md:pr-8"
>
	{#if page.url.searchParams.get('view') === 'card'}
		<span class="view-icon"><Icon name="list" /></span>
		<p>View as List</p>
	{:else}
		<span class="view-icon"><Icon name="card" /></span>
		<p>View as Card</p>
	{/if}
</Button>

<style>
	.view-icon {
		display: inline-flex;
		margin-top: auto;
		margin-bottom: auto;
	}
</style>
