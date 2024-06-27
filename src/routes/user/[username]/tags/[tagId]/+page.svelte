<script lang="ts">
	import Breadcrumbs from '$/components/UI/Breadcrumbs.svelte';
	import { currentUser } from '$lib/stores/user';
	import type { ITagEntryGenerics, TagRecord } from '$lib/types/ITags.js';
	import { getContext, setContext } from 'svelte';
	import { getMultiLanguageName } from '$lib/utils/language';
	import { getMoveEntry } from '$lib/data/games.js';
	import { primaryLanguage, secondaryLanguage } from '$lib/stores/domain.js';
	import { termNormaliser } from '$lib/utils/string.js';
	import SocialPreview from '$/components/SocialPreview.svelte';
	import { getSortFunction } from './helper.js';
	import TagHeader from './TagHeader.svelte';
	import TagEditor from './TagEditor.svelte';
	import { writable, type Writable } from 'svelte/store';
	import type { IPublicUser } from '$/lib/pb/publicUsers.js';
	import TagPokemon from './TagPokemon.svelte';

	export let data;
	setContext('tag', writable(data.tag));

	const currentTag = getContext('tag') as Writable<TagRecord>;

	export const tagOwner = writable<IPublicUser>(data.user);

	let filterTerm = '';

	$: filteredMove =
		filterTerm && $currentTag.contents.move
			? $currentTag.contents.move.filter((move) => {
					const normalised = termNormaliser(filterTerm);
					const matchesId = `${move.id}`.includes(normalised);
					const names = termNormaliser(
						getMultiLanguageName(
							getMoveEntry(move.id).names,
							$primaryLanguage,
							$secondaryLanguage
						) ?? ''
					);

					const matchesName = names.includes(normalised);
					return matchesId || matchesName;
			  })
			: $currentTag.contents.move ?? [];

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

<TagPokemon {filterTerm} {inModifyView} />
<!-- <div id="tagHeader">
	{#if $currentUser?.username === $tagOwner.username}
		<button
			class="button"
			style="max-height: 3rem;"
			on:click={async () => {
				if (inModifyView) {
					try {
						await saveUpdatedTag();
					} catch (err) {
						Logger.error(Logger.ErrorClasses.TagOperation, Logger.buildError(err), {
							context: `Tag ${$currentTag.id}`,
							message: 'Failed to save changes'
						});
						addNotification({ message: 'Failed to save changes', level: 'failure' });
						return;
					}
				}
				inModifyView = !inModifyView;
			}}
		>
			<Icon name={`${inModifyView ? 'floppy' : 'pencil'}`} />
		</button>
	{/if}

	<h1 class="h1" style="padding: 0;">{$currentTag.name}</h1>
	{#if $currentTag.isPrivate}
		<Icon name="lock" style="margin-top: auto; margin-bottom: auto;" />
	{/if}
</div>

{#if inModifyView}
	<div id="modifyWrapper">
		<button class="button" on:click={() => (showRenameOverlay = true)}>Rename</button>
		<button
			class="button"
			on:click={() => {
				$currentTag.showGenderAndShiny = !$currentTag.showGenderAndShiny;
				hasChanges = true;
			}}>{`${$currentTag.showGenderAndShiny ? 'Hide' : 'Show'}`} Variety indicators</button
		>
		<button
			class="button"
			on:click={() => {
				$currentTag.isPrivate = !$currentTag.isPrivate;
				hasChanges = true;
			}}>Make {$currentTag.isPrivate ? 'Public' : 'Private'}</button
		>
		<button
			class="button error"
			on:click={() => {
				showDeleteOverlay = true;
			}}>Delete Tag</button
		>
	</div>
{/if}



<div id="viewOptionsWrapper">
	<div style="display: none;">
		<button class="button" on:click={async () => {}}>Copy</button>
		<button
			class="button"
			on:click={() => {
				isLiked = !isLiked;
			}}><Icon name={isLiked ? 'heart-full' : 'heart'} style="" /></button
		>
	</div>

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

<div id="tagSearchWrapper">
	<input
		style="height: 3rem; padding-left: 2rem;"
		type="text"
		placeholder="Find in tags"
		bind:value={filterTerm}
	/>
</div>

{#if amountOfItems === 0}
	<p>This tag has no items in it</p>
{/if} -->
<!-- 
<div id="pokemonTagWrapper" class={$currentTag.contents.pokemon?.length === 0 ? 'hidden' : ''}>
	{#if displayMode === 'card'}
		<div
			class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6
				2xl:grid-cols-7 justify-items-center cardWrapper"
		>
			{#each filteredPokemon.sort(sortFunction) as pokemonTag}
				<PokemonCardEntry
					pokemon={pokemonTag}
					showRemoveButton={inModifyView}
					showGenderAndShiny={$currentTag.showGenderAndShiny}
					onRemoveClick={() => {
						// removeFromTag({ pokemon: pokemonTag });
					}}
				/>
			{/each}
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
			{#each filteredPokemon.sort(sortFunction) as pokemonTag}
				<PokemonListEntry
					pokemon={pokemonTag}
					showRemoveButton={inModifyView}
					showGenderAndShiny={$currentTag.showGenderAndShiny}
					onRemoveClick={() => {
						// removeFromTag({ pokemon: pokemonTag });
					}}
				/>
			{/each}
		</div>
	{/if}

	{#if $currentTag.contents.pokemon && $currentTag.contents.pokemon.length > 0}
		<div style="display: grid; justify-content: center; margin-top: 1rem;">
			<p style="min-width: fit-content;">{$currentTag.contents.pokemon.length} Pokémon</p>
		</div>
	{/if}
</div>

<div
	id="moveTagWrapper"
	class="tagGroup"
	style={$currentTag.contents.move?.length === 0 ? 'display: none' : ''}
>
	<div class="tagWrapper">
		{#each filteredMove.sort(sortFunction) as moveTag}
			{#if displayMode === 'card'}
				<MoveCardEntry
					id={moveTag.id}
					showRemoveButton={inModifyView}
					onRemoveClick={() => {
						// removeFromTag({ move: moveTag });
					}}
				/>
			{:else}
				<MoveListEntry
					id={moveTag.id}
					showRemoveButton={inModifyView}
					onRemoveClick={() => {
						// removeFromTag({ move: moveTag });
					}}
				/>
			{/if}
		{/each}
	</div>

	{#if $currentTag.contents.move && $currentTag.contents.move.length > 0}
		<div style="display: grid; justify-content: center;">
			<p style="min-width: fit-content;">
				{$currentTag.contents.move.length} Move{$currentTag.contents.move.length === 1 ? '' : 's'}
			</p>
		</div>
	{/if}
</div>

<Modal bind:showModal={showDeleteOverlay}>
	<h2 class="h2" slot="header">Delete Tag</h2>

	<div style="padding-top: 1rem;">
		<p>Are you sure you want to delete this tag and all of its contents?</p>
	</div>

	<div style="display: flex; justify-content: space-between; padding-top: 1rem;">
		<button
			class="button error"
			on:click={async () => {
				showDeleteOverlay = false;
				// await deleteTag();
			}}
		>
			Yes, delete
		</button>

		<button
			class="button"
			on:click={() => {
				showDeleteOverlay = false;
			}}
		>
			No, cancel
		</button>
	</div>
</Modal> -->
