<script lang="ts">
	import PokemonPreview from '$/components/Pokemon/PokemonPreview.svelte';
	import { getPokemonEntry, type IStaticPokemon } from '$lib/data/games';
	import { maxSearchResults, primaryLanguage, secondaryLanguage } from '$lib/stores/domain';
	import { getLanguageEntry } from '$lib/utils/language';
	import { termNormaliser } from '$lib/utils/string';

	export let pokemonResults: { id: number }[];
	export let showMoreText: string;
	export let filterTerm: string;

	let maxResults = maxSearchResults;

	$: term = termNormaliser(filterTerm);

	$: filteredResults = filterTerm
		? pokemonResults.filter((result) => {
				const names = getPokemonEntry(result.id).names;
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const lang1 = termNormaliser(getLanguageEntry(names, $primaryLanguage));
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const lang2 = termNormaliser(getLanguageEntry(names, $secondaryLanguage));

				return result.id.toString().includes(term) || lang1.includes(term) || lang2.includes(term);
		  })
		: pokemonResults;
</script>

<div class="pokemonGrouping">
	{#each filteredResults as pokemon, index}
		{#if index < maxResults}
			<PokemonPreview pokemon={{ id: pokemon.id }} />
		{/if}
	{/each}
</div>

{#if maxResults < filteredResults.length}
	<div style="display: flex; flex-direction: column">
		<button
			class="button"
			style="margin-top: 1rem;"
			on:click={() => {
				maxResults += maxSearchResults;
			}}>{showMoreText}</button
		>
	</div>
{/if}

<style>
	.pokemonGrouping:not(:first-child) {
		margin-top: 1rem;
	}
</style>
