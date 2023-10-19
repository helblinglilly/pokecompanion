<script lang="ts">
	import PokemonPreview from '$components/PokemonPreview.svelte';
	import { maxSearchResults } from '$lib/stores/domain';
	import type { IPokemonNames } from '../../routes/pokemon/+page';

	export let pokemonResults: IPokemonNames[];
	let maxResults = maxSearchResults;
</script>

{#each pokemonResults as pokemon, index}
	{#if index < maxResults}
		<PokemonPreview {pokemon} />
	{/if}
{/each}
{#if maxResults < pokemonResults.length}
	<div style="display: flex; flex-direction: column">
		<button
			class="button"
			style="margin-top: 1rem;"
			on:click={() => {
				maxResults += maxSearchResults;
			}}>Show more results...</button
		>
	</div>
{/if}
