<script lang="ts">
	import Breadcrumbs from '$/components/UI/Breadcrumbs.svelte';
	import { currentUser } from '$lib/stores/user';
	import type { ITagEntryGenerics, TagRecord } from '$lib/types/ITags.js';
	import { getContext, setContext } from 'svelte';
	import SocialPreview from '$/components/SocialPreview.svelte';
	import { getSortFunction } from './helper.js';
	import TagHeader from './TagHeader.svelte';
	import TagEditor from './TagEditor.svelte';
	import { writable, type Writable } from 'svelte/store';
	import type { IPublicUser } from '$/lib/pb/publicUsers.js';
	import TagPokemon from './TagPokemon.svelte';
	import TagMove from './TagMove.svelte';

	export let data;
	setContext('tag', writable(data.tag));

	const currentTag = getContext('tag') as Writable<TagRecord>;
	$: items = ($currentTag.contents.pokemon?.length ?? 0) + ($currentTag.contents.move?.length ?? 0);

	export const tagOwner = writable<IPublicUser>(data.user);

	let filterTerm = '';

	let inModifyView = false;
	let sortOrder = data.tag.sortOrder;
	let sortKey = data.tag.sortKey;

	let sortFunction = (a: ITagEntryGenerics, b: ITagEntryGenerics) => 1;

	$: if (sortKey || sortOrder) {
		let vals = getSortFunction(sortKey, sortOrder);
		sortKey = vals.sortKey;
		sortOrder = vals.sortOrder;
		sortFunction = vals.sortFunction;
	}
</script>

<SocialPreview
	title={`"${$currentTag.name}" tag`}
	description={`${$tagOwner.username} created this tag with ${
		$currentTag.contents.pokemon ? $currentTag.contents.pokemon.length : 0
	} Pokémon`}
/>

<Breadcrumbs
	breadcrumbs={[
		{
			display: data.user.username,
			url: `/user/${data.user.username}`
		},
		{
			display: $currentTag.name
		}
	]}
/>

<div class="grid gap-4 pb-4">
	<TagHeader tag={$currentTag} bind:inModifyView />

	{#if $currentUser?.username === $tagOwner.username && inModifyView}
		<hr />
		<p>Created: {new Date($currentTag.created).toLocaleString()}</p>
		<p>Updated: {new Date($currentTag.updated).toLocaleString()}</p>
		<div class="grid md:inline-flex md:justify-between gap-2">
			<TagEditor />
		</div>
		<hr />
	{/if}
</div>

{#if items >= 20}
	<div class="mb-4 w-full justify-center grid">
		<input
			class="pl-8 w-full md:w-64"
			style="width: 100%; height: 3rem;"
			type="text"
			placeholder="Find in tag"
			bind:value={filterTerm}
		/>
	</div>
{/if}

<div class="grid gap-4">
	<TagPokemon {filterTerm} {inModifyView} />

	<TagMove {filterTerm} {inModifyView} />
</div>

<div class="w-full text-center mt-12">
	<i>{items} entries</i>
</div>
<!--
<div id="viewOptionsWrapper">
	<div class="min-w-fit">
		<p>View:</p>
	</div>
	<button
		class={`button ${displayMode === 'list' ? 'selected' : ''}`}
		on:click={() => {
			displayMode = 'list';
		}}><Icon name="list" style="" /></button
	>
	<button
		class={`button ${displayMode === 'card' ? 'selected' : ''}`}
		on:click={() => {
			displayMode = 'card';
		}}><Icon name="card" style="" /></button
	>

	<select
		class="pl-4 pr-4 secondary"
		on:change={(e) => {
			// @ts-ignore
			sortFunction = getSortFunction(e.target?.value, sortOrder);
		}}
	>
		<option>Added</option>
		<option>ID</option>
	</select>

	<button
		class="button primary min-w-fit"
		on:click={() => {
			sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		}}
	>
		{sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
	</button>
</div>
-->
