<script lang="ts">
	import PokemonLink from '$/ui/molecules/pokemon/link/PokemonLink.svelte';
	import PokemonListEntry from '$/ui/molecules/pokemon/list';
	import { getPokemonEntry } from '$lib/data/games';
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

<div class="grid gap-4">
	{#each filteredResults as pokemon, index}
		{#if index < maxResults}
			<PokemonLink pokemon={{ id: pokemon.id, shiny: false }}>
				<PokemonListEntry
					pokemon={{
						id: pokemon.id,
						shiny: false
					}}
				/>
			</PokemonLink>
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
