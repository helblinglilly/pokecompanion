<script lang="ts">
	import Breadcrumbs from '$/lib/components/Breadcrumbs.svelte';
	import { currentUser } from '$lib/stores/user';
	import { getContext, setContext } from 'svelte';
	import SocialPreview from '$/lib/components/SocialPreview.svelte';
	import Header from '$/ui/molecules/Collections/Header.svelte';
	import TagEditor from './TagEditor.svelte';
	import { writable, type Writable } from 'svelte/store';
	import TagPokemon from './TagPokemon.svelte';
	import TagMove from './TagMove.svelte';
	import TagViewOptions from './TagViewOptions.svelte';
	import type { APITag } from '$/@types/api.pokecompanion';

	export let data;
	setContext('tag', writable(data.tag));

	const currentTag = getContext('tag') as Writable<APITag['tags'][number]>;
	$: items = ($currentTag.contents.pokemon?.length ?? 0) + ($currentTag.contents.move?.length ?? 0);

	export const tagOwner = writable(data.user);

	let filterTerm = '';

	let inModifyView = false;
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
	{#await data.tagPokemon}
		<p>Loading Pokemon...</p>
	{:then tagPokemon}
		<TagPokemon {filterTerm} {inModifyView} allPokemon={tagPokemon} />
	{/await}

	{#await data.tagMoves}
		<p>Loading Moves...</p>
	{:then tagMoves}
		<TagMove {filterTerm} {inModifyView} moveCollection={tagMoves.moves} />
	{/await}
</div>

<div class="w-full text-center mt-12">
	<i>{items} entries</i>

	{#if $currentUser?.username === $tagOwner.username}
		<p>Created: {new Date($currentTag.created).toLocaleString()}</p>
		<p>Updated: {new Date($currentTag.updated).toLocaleString()}</p>
	{/if}
</div>
