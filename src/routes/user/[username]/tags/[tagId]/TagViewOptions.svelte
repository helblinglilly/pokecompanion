<script lang="ts">
	import Icon from '$/components/UI/Icon.svelte';
	import { type TagRecord } from '$/lib/types/ITags';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	let tag = getContext('tag') as Writable<TagRecord>;

	function replaceQueryParam(name: string, value: string) {
		const newSearchParams = new URLSearchParams($page.url.searchParams);
		newSearchParams.set(name, value);
		goto(`?${newSearchParams}`, { replaceState: true, noScroll: true });
	}
</script>

<button
	class="button primary"
	on:click={() => {
		const newViewState = $page.url.searchParams.get('view') === 'list' ? 'card' : 'list';
		replaceQueryParam('view', newViewState);
	}}
>
	{#if $page.url.searchParams.get('view') === 'list'}
		<div class="inline-flex align-middle gap-2">
			<Icon name="card" style="margin-top: auto; margin-bottom: auto;" />
			<p>View as Card</p>
		</div>
	{:else}
		<div class="inline-flex align-middle gap-2">
			<Icon name="list" style="margin-top: auto; margin-bottom: auto;" />
			<p>View as List</p>
		</div>
	{/if}
</button>

<div class="inline-flex">
	<label for="sortBy" class="absolute self-center pl-4">Sort by:</label>
	<select
		name="sortBy"
		class="text-center w-full md:w-64 h-14"
		value={$tag.sortKey}
		on:change={(e) => {
			// @ts-ignore Can't cast type in Svelte
			if (e.target?.value) {
				// @ts-ignore Can't cast type in Svelte
				replaceQueryParam('sortBy', e.target.value ?? '');
			}
		}}
	>
		<option value="id">ID</option>
		<option value="added">Date added</option>
	</select>
</div>

<div class="inline-flex">
	<select
		name="sortOrder"
		class="text-center w-full md:w-64 h-14"
		value={$tag.sortOrder}
		on:change={(e) => {
			// @ts-ignore Can't cast type in Svelte
			if (e.target?.value) {
				// @ts-ignore Can't cast type in Svelte
				replaceQueryParam('sortOrder', e.target.value ?? '');
			}
		}}
	>
		<option value="asc">Ascending</option>
		<option value="desc">Descending</option>
	</select>
</div>

<style>
	select {
		background-color: var(--accent);
	}
</style>
