<script lang="ts">
	import Icon from '$/ui/atoms/icon/Icon.svelte';
	import Button from '$/ui/atoms/button/Button.svelte';
	import Select from '$/ui/atoms/select/Select.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { APITag } from '$/@types/api.pokecompanion';

	let tag = getContext('tag') as Writable<APITag['tags'][number]>;

	function replaceQueryParam(name: string, value: string) {
		const newSearchParams = new URLSearchParams($page.url.searchParams);
		newSearchParams.set(name, value);
		goto(`?${newSearchParams}`, { replaceState: true, noScroll: true });
	}
</script>

<Button
	on:click={() => {
		const newViewState = $page.url.searchParams.get('view') === 'card' ? 'list' : 'card';
		replaceQueryParam('view', newViewState);
	}}
	classes="inline-flex align-middle gap-2 w-56 md:pr-8"
>
	{#if $page.url.searchParams.get('view') === 'card'}
		<Icon name="list" style="margin-top: auto; margin-bottom: auto;" />
		<p>View as List</p>
	{:else}
		<Icon name="card" style="margin-top: auto; margin-bottom: auto;" />
		<p>View as Card</p>
	{/if}
</Button>

<p class="w-full md:w-fit md:pl-4">Sorting:</p>
<div class="inline-flex align-middle w-56">
	<Select
		style="margin: 0; padding-left: 4rem; padding-right: 4rem; text-align: center;"
		value={$tag.sortKey}
		options={[
			{
				value: 'added',
				label: 'Date Added'
			},
			{
				value: 'id',
				label: 'ID'
			}
		]}
		on:change={({ detail }) => {
			replaceQueryParam('sortBy', detail);
		}}
	/>
</div>

<div class="inline-flex w-56">
	<Select
		name="sortOrder"
		value={$tag.sortOrder}
		style="margin: 0; padding-left: 4rem; padding-right: 4rem; text-align: center;"
		options={[
			{
				label: 'Ascending',
				value: 'asc'
			},
			{
				label: 'Descending',
				value: 'desc'
			}
		]}
		on:change={({ detail }) => {
			replaceQueryParam('sortOrder', detail);
		}}
	/>
</div>
