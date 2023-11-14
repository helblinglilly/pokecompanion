<script lang="ts">
	import { page } from '$app/stores';
	import AbilityResults from '$components/Search/AbilityResults.svelte';
	import ItemResults from '$components/Search/ItemResults.svelte';
	import MoveResults from '$components/Search/MoveResults.svelte';
	import PokemonResults from '$components/Search/PokemonResults.svelte';
	import { onMount } from 'svelte';

	interface IResults {
		pokemon: any[];
		items: any[];
		abilities: any[];
		moves: any[];
	}

	const fetchData = async () => {
		try {
			const response = await fetch(`/api/search?term=${searchTerm}`);
			const body = (await response.json()) as { data: IResults };
			results = body.data;
			if (
				results.abilities.length === 0 &&
				results.items.length === 0 &&
				results.moves.length === 0 &&
				results.pokemon.length === 0
			) {
				errorMessage = 'No search results. Try another search';
			} else {
				errorMessage = '';
			}
		} catch (err) {
			errorMessage = "Couldn't get search results";
		}
	};

	$: searchTerm = $page.url.searchParams.get('term');

	let errorMessage: string | undefined;
	let results: IResults;

	onMount(async () => {
		await fetchData();
	});

	$: if (searchTerm) fetchData();
</script>

<h1>Search results</h1>

{#if errorMessage}
	<p>{errorMessage}</p>
{/if}

{#if results}
	<div id="searchResults">
		{#if results.pokemon.length > 0}
			<div>
				<h2 id="pokemon">Pokémon</h2>
				<PokemonResults pokemonResults={results.pokemon} />
			</div>
		{/if}

		{#if results.items.length > 0}
			<div>
				<h2 id="items">Items</h2>
				<ItemResults itemResults={results.items} />
			</div>
		{/if}

		{#if results.abilities.length > 0}
			<div>
				<h2 id="abilities">Abilities</h2>
				<AbilityResults abilityResults={results.abilities} />
			</div>
		{/if}

		{#if results.moves.length > 0}
			<div>
				<h2 id="moves">Moves</h2>
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
