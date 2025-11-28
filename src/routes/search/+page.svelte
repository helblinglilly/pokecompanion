<script lang="ts">
	import { page } from '$app/stores';
	import SocialPreview from '$/lib/components/SocialPreview.svelte';
	import { Logger } from '$lib/log.js';
	import { primaryLanguage, secondaryLanguage, SettingNames } from '$lib/stores/domain.js';
	import { searchTerm } from '$lib/stores/searchbar.js';
	import { getMultiLanguageName, type Languages } from '$lib/utils/language.js';
	import { onMount } from 'svelte';
	import PokemonListEntry from '$/ui/molecules/pokemon/list';
	import Button from '$/ui/atoms/button/Button.svelte';
	import PokemonLink from '$/ui/molecules/pokemon/link/PokemonLink.svelte';
	import ItemListEntry from '$/ui/molecules/item/list/ItemListEntry.svelte';
	import Card from '$/ui/atoms/card/Card.svelte';

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
		await Logger.addPageAction('SearchResult', {
			searchTerm: data.searchTerm,
			abilityResults: data.results.abilities.length,
			itemResults: data.results.items.length,
			moveResults: data.results.moves.length,
			pokemonResults: data.results.pokemon.length
		});
	});

	const primaryLanguageOverride = $page.url.searchParams.get(SettingNames.PrimaryLanguage);
	const secondaryLanguageOverride = $page.url.searchParams.get(SettingNames.SecondaryLanguage);

	if (primaryLanguageOverride) {
		primaryLanguage.set(primaryLanguageOverride as keyof Languages);
	}

	if (secondaryLanguageOverride) {
		secondaryLanguage.set(secondaryLanguageOverride as keyof Languages);
	}

	let defaultResults = 10;
	let pokemonResults = defaultResults;
	let itemResults = defaultResults;
	let moveResults = defaultResults;
	let abilityResults = defaultResults;
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
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
	<div id="searchResults" class="grid md:grid-cols-2 gap-4 pb-4">
		{#if results.pokemon.length > 0}
			<section class="grid gap-4 w-full h-fit" aria-label="Pokemon results">
				<h2 class="h2" id="pokemon">Pokémon</h2>
				{#each results.pokemon as pokemon, i}
					{#if i < pokemonResults}
						<PokemonLink pokemon={{ id: pokemon.id, shiny: false, variety: pokemon.variety }}>
							<PokemonListEntry
								pokemon={{
									id: pokemon.id,
									variety: pokemon.variety,
									shiny: false
								}}
							/>
						</PokemonLink>
					{/if}
				{/each}

				{#if results.pokemon.length > pokemonResults}
					<Button
						on:click={() => {
							pokemonResults += defaultResults;
						}}
					>
						Show {defaultResults} more Pokemon results ({pokemonResults}/{results.pokemon.length})
					</Button>
				{/if}
			</section>
		{/if}

		{#if results.items.length > 0}
			<section class="grid gap-4 w-full h-fit" aria-label="Item results">
				<h2 class="h2" id="items">Items</h2>
				{#each results.items as item, i}
					{#if i < itemResults}
						<a href={`/item/${item.id}`} class="no-underline">
							<ItemListEntry {item} />
						</a>
					{/if}
				{/each}

				{#if results.items.length > itemResults}
					<Button
						on:click={() => {
							itemResults += defaultResults;
						}}
					>
						Show {defaultResults} more Item results ({itemResults}/{results.items.length})
					</Button>
				{/if}
			</section>
		{/if}

		{#if results.abilities.length > 0}
			<section class="grid gap-4 w-full h-fit" aria-label="Ability results">
				<h2 class="h2" id="ability">Abilities</h2>
				{#each results.abilities as ability, i}
					{#if i < abilityResults}
						<a href={`/ability/${ability.id}`} class="no-underline">
							<Card
								isClickable
								classes="m-0 w-full inline-flex justify-between"
								style={`position: relative; padding: 0.5rem; min-height: 7rem;`}
							>
								<p class="mt-auto mb-auto pl-4">
									{getMultiLanguageName(ability.names, $primaryLanguage, $secondaryLanguage)}
								</p>
							</Card>
						</a>
					{/if}
				{/each}

				{#if results.abilities.length > abilityResults}
					<Button
						on:click={() => {
							abilityResults += defaultResults;
						}}
					>
						Show {defaultResults} more Ability results ({abilityResults}/{results.abilities.length})
					</Button>
				{/if}
			</section>
		{/if}

		{#if results.moves.length > 0}
			<section class="grid gap-4 w-full h-fit" aria-label="Move results">
				<h2 class="h2" id="ability">Moves</h2>
				{#each results.moves as move, i}
					{#if i < moveResults}
						<a href={`/move/${move.id}`} class="no-underline">
							<Card
								isClickable
								classes="m-0 w-full inline-flex justify-between"
								style={`position: relative; padding: 0.5rem; min-height: 7rem;`}
							>
								<p class="mt-auto mb-auto pl-4">
									{getMultiLanguageName(move.names, $primaryLanguage, $secondaryLanguage)}
								</p>
							</Card>
						</a>
					{/if}
				{/each}

				{#if results.moves.length > moveResults}
					<Button
						on:click={() => {
							moveResults += defaultResults;
						}}
					>
						Show {defaultResults} more Move results ({moveResults}/{results.moves.length})
					</Button>
				{/if}
			</section>
		{/if}
	</div>
{/if}
