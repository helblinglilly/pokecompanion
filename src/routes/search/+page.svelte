<script lang="ts">
	import { page } from '$app/stores';
	import AbilityResults from '$components/Search/AbilityResults.svelte';
	import ItemResults from '$components/Search/ItemResults.svelte';
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
	{#if results.pokemon.length > 0}
		<h2 style="margin-top: 2rem;" id="pokemon">Pokémon</h2>
		<PokemonResults pokemonResults={results.pokemon} />
	{/if}

	{#if results.items.length > 0}
		<h2 style="margin-top: 4rem;" id="items">Items</h2>
		<ItemResults itemResults={results.items} />
	{/if}

	{#if results.abilities.length > 0}
		<h2 style="margin-top: 4rem;" id="abilities">Abilities</h2>
		<AbilityResults abilityResults={results.abilities} />
	{/if}
{/if}
