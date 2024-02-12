<script lang="ts">
	import { page } from '$app/stores';
	import AbilityResults from '$components/Search/AbilityResults.svelte';
	import ItemResults from '$components/Search/ItemResults.svelte';
	import MoveResults from '$components/Search/MoveResults.svelte';
	import PokemonGroup from '$components/UI/PokemonGroup.svelte';
	import { primaryLanguage, secondaryLanguage } from '$lib/stores/domain.js';
	import { searchTerm } from '$lib/stores/searchbar.js';
	import type { Languages } from '$lib/utils/language.js';

	export let data;
	let { errorMessage, results } = data;

	$: {
		if (data) {
			errorMessage = data.errorMessage;
			results = data.results;
			searchTerm.set(data.searchTerm ?? '');
		}
	}

	const primaryLanguageOverride = $page.url.searchParams.get('primaryLanguage');
	const secondaryLanguageOverride = $page.url.searchParams.get('secondaryLanguage');

	if (primaryLanguageOverride) {
		primaryLanguage.set(primaryLanguageOverride as keyof Languages);
	}

	if (secondaryLanguageOverride) {
		secondaryLanguage.set(secondaryLanguageOverride as keyof Languages);
	}
</script>

<svelte:head>
	<title>Search results - Pokecompanion</title>
</svelte:head>

<h1 class="h1">Search results</h1>

{#if errorMessage}
	<p>{errorMessage}</p>
{/if}

{#if results}
	<div id="searchResults">
		{#if results.pokemon.length > 0}
			<div>
				<h2 class="h2" id="pokemon">Pokémon</h2>
				<PokemonGroup
					pokemonResults={results.pokemon}
					showMoreText="Show more results..."
					filterTerm=""
				/>
			</div>
		{/if}

		{#if results.items.length > 0}
			<div>
				<h2 class="h2" id="items">Items</h2>
				<ItemResults itemResults={results.items} />
			</div>
		{/if}

		{#if results.abilities.length > 0}
			<div>
				<h2 class="h2" id="abilities">Abilities</h2>
				<AbilityResults abilityResults={results.abilities} />
			</div>
		{/if}

		{#if results.moves.length > 0}
			<div>
				<h2 class="h2" id="moves">Moves</h2>
				<MoveResults moveResults={results.moves} />
			</div>
		{/if}
	</div>
{/if}

<style>
	#searchResults > :first-child {
		padding-top: 2rem;
	}

	#searchResults > :not(:first-child) {
		padding-top: 4rem;
	}
</style>
