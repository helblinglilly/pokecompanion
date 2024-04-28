<script lang="ts">
	import { page } from '$app/stores';
	import AbilityResults from '$/components/Search/AbilityResults.svelte';
	import ItemResults from '$/components/Search/ItemResults.svelte';
	import MoveResults from '$/components/Search/MoveResults.svelte';
	import SocialPreview from '$/components/SocialPreview.svelte';
	import PokemonGroup from '$/components/UI/PokemonGroup.svelte';
	import { Logger } from '$lib/log.js';
	import { primaryLanguage, secondaryLanguage } from '$lib/stores/domain.js';
	import { searchTerm } from '$lib/stores/searchbar.js';
	import type { Languages } from '$lib/utils/language.js';
	import { onMount } from 'svelte';

	export let data;
	let { errorMessage, results } = data;

	$: {
		if (data) {
			errorMessage = data.errorMessage;
			results = data.results;
			searchTerm.set(data.searchTerm ?? '');
		}
	}

	onMount(async () => {
		await Logger.addPageAction('SearchResult', data.errorMessage, {
			searchTerm: data.searchTerm,
			abilityResults: data.results.abilities.length,
			itemResults: data.results.items.length,
			moveResults: data.results.moves.length,
			pokemonResults: data.results.pokemon.length
		});
	});

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
	<meta name="robots" content="noindex">
</svelte:head>

<SocialPreview
	title={`${data.searchTerm} results`}
	previewImage="https://socialpreviews.pokecompanion.helbling.uk/results.png"
	description={`View results across Pokémon, Items, Moves and Abilities`}
/>

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
