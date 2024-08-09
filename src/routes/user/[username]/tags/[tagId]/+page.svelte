<script lang="ts">
	import Breadcrumbs from '$/components/UI/Breadcrumbs.svelte';
	import { currentUser } from '$lib/stores/user';
	import type { ITagEntryGenerics, TagRecord } from '$lib/types/ITags.js';
	import { getContext, setContext } from 'svelte';
	import SocialPreview from '$/components/SocialPreview.svelte';
	import { getSortFunction } from './helper.js';
	import Header from '$/ui/molecules/Collections/Header/Header.svelte';
	import TagEditor from './TagEditor.svelte';
	import { writable, type Writable } from 'svelte/store';
	import type { IPublicUser } from '$/lib/pb/publicUsers.js';
	import TagPokemon from './TagPokemon.svelte';
	import TagMove from './TagMove.svelte';
	import TagViewOptions from './TagViewOptions.svelte';

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

<div class="grid gap-4 pb-4 text-center md:text-left">
	<Header entry={$currentTag} bind:inModifyView />

	<div class="w-full justify-center md:w-fit grid md:inline-flex gap-2 items-center">
		{#if $currentUser?.username === $tagOwner.username && inModifyView}
			<TagEditor />
		{:else if !inModifyView}
			<TagViewOptions />
		{/if}
	</div>
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

	{#if $currentUser?.username === $tagOwner.username}
		<p>Created: {new Date($currentTag.created).toLocaleString()}</p>
		<p>Updated: {new Date($currentTag.updated).toLocaleString()}</p>
	{/if}
</div>
