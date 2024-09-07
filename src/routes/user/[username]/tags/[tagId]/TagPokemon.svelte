<script lang="ts">
	import PokemonCardEntry from '$/ui/molecules/pokemon/card';
	import { getPokemonEntry } from '$/lib/data/games';
	import { primaryLanguage, secondaryLanguage } from '$/lib/stores/domain';
	import { getMultiLanguageName } from '$/lib/utils/language';
	import { termNormaliser } from '$/lib/utils/string';
	import { page } from '$app/stores';
	import { getContext } from 'svelte';
	import { type Writable } from 'svelte/store';
	import { getSortFunction, patchTag } from './helper';
	import { isEqual } from 'lodash-es';
	import PokemonListEntry from '$/ui/molecules/pokemon/list';
	import PokemonLink from '$/ui/molecules/pokemon/link/PokemonLink.svelte';
	import type { RecordTag } from '$/routes/api/tag/types';
	export let filterTerm: string;

	export let inModifyView: boolean;

	let tag = getContext('tag') as Writable<RecordTag>;

	$: pokemonCollection = $tag.contents.pokemon
		?.filter((mon) => {
			const normalised = termNormaliser(filterTerm);
			const matchesId = `${mon.id}`.includes(filterTerm);
			const names = termNormaliser(
				getMultiLanguageName(
					getPokemonEntry(mon.id).names,
					$primaryLanguage,
					$secondaryLanguage,
					mon.variety ?? ''
				) ?? ''
			);

			const matchesName = names.includes(normalised);
			return matchesId || matchesName;
		})
		.sort(
			getSortFunction(
				($page.url.searchParams.get('sortBy') || $tag.sortKey) as unknown as RecordTag['sortKey'],
				($page.url.searchParams.get('sortOrder') ||
					$tag.sortOrder) as unknown as RecordTag['sortOrder']
			).sortFunction
		);
</script>

{#if !pokemonCollection || pokemonCollection.length === 0}
	<p>No Pokemon</p>
{:else if $page.url.searchParams.get('view') === 'card'}
	<h2 class="h2">Pokémon</h2>
	<div
		class="grid gap-8 justify-center grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl-grid-cols-6"
	>
		{#each pokemonCollection as pokemon}
			<PokemonLink {pokemon} isLinkHidden={inModifyView}>
				<PokemonCardEntry
					{pokemon}
					showGenderAndShiny={$tag.showGenderAndShiny}
					isClickable={!inModifyView}
				>
					<button
						slot="remove"
						class={`removeButton ${inModifyView ? '' : 'hidden'}`}
						on:click={() => {
							const optimisticTag = {
								...$tag,
								contents: {
									...$tag.contents,
									pokemon: $tag.contents.pokemon?.filter((tagMon) => !isEqual(tagMon, pokemon))
								}
							};
							const originalTag = { ...$tag };

							tag.set(optimisticTag);

							patchTag(optimisticTag).then((newTag) => {
								if (newTag) {
									tag.set(newTag);
								} else {
									tag.set(originalTag);
								}
							});
						}}>-</button
					>
				</PokemonCardEntry>
			</PokemonLink>
		{/each}
	</div>
{:else}
	<h2 class="h2">Pokémon</h2>
	<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
		{#each pokemonCollection as pokemon}
			<PokemonLink {pokemon} isLinkHidden={inModifyView}>
				<PokemonListEntry {pokemon} showGenderAndShiny={$tag.showGenderAndShiny}>
					<button
						slot="remove"
						class={`removeButton ${inModifyView ? '' : 'hidden'}`}
						on:click={(e) => {
							const optimisticTag = {
								...$tag,
								contents: {
									...$tag.contents,
									pokemon: $tag.contents.pokemon?.filter((tagMon) => !isEqual(tagMon, pokemon))
								}
							};
							const originalTag = { ...$tag };

							tag.set(optimisticTag);

							fetch(`/api/tag/${$tag.id}/pokemon`, {
								method: 'DELETE',
								body: JSON.stringify({
									id: pokemon.id
								})
							}).then((res) => {
								if (res.ok) {
									tag.set(optimisticTag);
								} else {
									tag.set(originalTag);
								}
							});
						}}>-</button
					>
				</PokemonListEntry>
			</PokemonLink>
		{/each}
	</div>
{/if}

<style>
	.removeButton {
		position: absolute;
		top: 0;
		right: 0;
		text-align: center;
		height: 2rem;
		width: 2rem;
		border-radius: 10%;
		font-weight: bold;
		color: var(--light);
		background-color: var(--error);
		z-index: 10;
	}
</style>
