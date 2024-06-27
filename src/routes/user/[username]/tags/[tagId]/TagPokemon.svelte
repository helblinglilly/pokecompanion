<script lang="ts">
	import PokemonCardEntry from '$/components/Tags/PokemonCardEntry.svelte';
	import { getPokemonEntry } from '$/lib/data/games';
	import { primaryLanguage, secondaryLanguage } from '$/lib/stores/domain';
	import type { TagRecord } from '$/lib/types/ITags';
	import { getMultiLanguageName } from '$/lib/utils/language';
	import { termNormaliser } from '$/lib/utils/string';
	import { page } from '$app/stores';
	import { getContext } from 'svelte';
	import { type Writable } from 'svelte/store';
	import { patchTag } from './helper';
	import { isEqual } from 'lodash-es';
	import PokemonListEntry from '$/components/Tags/PokemonListEntry.svelte';
	export let filterTerm: string;

	export let inModifyView: boolean;

	let tag = getContext('tag') as Writable<TagRecord>;

	$: pokemonCollection = $tag.contents.pokemon?.filter((mon) => {
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
	});
</script>

{#if !pokemonCollection || pokemonCollection.length === 0}
	<p>No Pokemon</p>
{:else if $page.url.searchParams.get('view') === 'list'}
	<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
		{#each pokemonCollection as pokemon}
			<PokemonListEntry
				{pokemon}
				showRemoveButton={inModifyView}
				showGenderAndShiny={$tag.showGenderAndShiny}
				onRemoveClick={() => {
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
				}}
			/>
		{/each}
	</div>
{:else}
	<div
		class="grid gap-y-8 justify-center grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl-grid-cols-6"
	>
		{#each pokemonCollection as pokemon}
			<PokemonCardEntry
				{pokemon}
				showRemoveButton={inModifyView}
				showGenderAndShiny={$tag.showGenderAndShiny}
				onRemoveClick={() => {
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
				}}
			/>
		{/each}
	</div>
{/if}
