<script lang="ts">
	import { onMount } from 'svelte';
	import PokemonNames from '$lib/data/pokemonNames.json';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Generations, Regions } from '$lib/data/games';
	import { lastPokedexEntry, pokemonPageSize } from '$lib/stores/domain';
	import SocialPreview from '$/components/SocialPreview.svelte';
	import AdjustedPokemonNames from './pokemonNames';
	import PokemonListEntry from '$/ui/molecules/pokemon/list';
	import PageNavigator from './PagaeNavigator.svelte';

	const numberOfPages = Math.ceil(PokemonNames.length / pokemonPageSize);

	$: pageNumber = () => {
		const searchParamsPage = Number($page.url.searchParams.get('page'));
		if (searchParamsPage && searchParamsPage <= numberOfPages && searchParamsPage >= 1) {
			return searchParamsPage;
		}
		return 1;
	};

	$: fromPokemon = 1 + (pageNumber() - 1) * pokemonPageSize - 1;

	let showHints = false;

	onMount(() => {
		document.addEventListener('keydown', (e) => {
			if (e.key === 'ArrowLeft' && pageNumber() > 1) {
				goto(`/pokemon?page=${pageNumber() - 1}`);
			} else if (e.key === 'ArrowRight' && pageNumber() < numberOfPages) {
				goto(`/pokemon?page=${pageNumber() + 1}`);
			}
		});
	});
</script>

<SocialPreview
	title="Pokémon"
	previewImage="https://socialpreviews.pokecompanion.helbling.uk/pokemonPage.png"
/>

<div class="columns w-full gap-4 mb-4">
	<div class="column">
		<h1 class="h1">All Pokémon</h1>
	</div>

	<div class="column inline-flex gap-4 content-center">
		<PageNavigator />
	</div>

	<div class="column justify-center content-center">
		<form class="flex justify-center" action="/pokemon/">
			<button
				class="button"
				id="hintButton"
				type="button"
				on:click={(e) => {
					if (e.type === 'click') {
						showHints = !showHints;
					}
				}}
				>?
			</button>
			<input
				id="jumpToText"
				name="jumpTo"
				type="number"
				placeholder="Jump to ID"
				max={lastPokedexEntry}
				style="height: 100%;"
			/>
			<button class="button" type="submit" id="jumpToButton" style="height: 100%;">Go</button>
		</form>
	</div>
</div>

<div class="columns">
	<div class="column">
		<div class="columns" style="display: flex; align-content: center; justify-content: center;" />

		<div class="columns" style={`display: ${showHints ? 'grid' : 'none'};`}>
			<div class="hintEntry">
				<p>#1 - #{Generations[0].nationalDexEnd}</p>
				<p>{Regions.KANTO}</p>
			</div>
			<div class="hintEntry">
				<p>#{Generations[0].nationalDexEnd + 1} - #{Generations[1].nationalDexEnd}</p>
				<p>{Regions.JOHTO}</p>
			</div>
			<div class="hintEntry">
				<p>#{Generations[1].nationalDexEnd + 1} - #{Generations[2].nationalDexEnd}</p>
				<p>{Regions.HOENN}</p>
			</div>
			<div class="hintEntry">
				<p>#{Generations[2].nationalDexEnd + 1} - #{Generations[3].nationalDexEnd}</p>
				<p>{Regions.SINNOH}</p>
			</div>
			<div class="hintEntry">
				<p>#{Generations[3].nationalDexEnd + 1} - #{Generations[4].nationalDexEnd}</p>
				<p>{Regions.UNOVA}</p>
			</div>

			<div class="hintEntry">
				<p>#{Generations[4].nationalDexEnd + 1} - #{Generations[5].nationalDexEnd}</p>
				<p>{Regions.KALOS}</p>
			</div>

			<div class="hintEntry">
				<p>#{Generations[5].nationalDexEnd + 1} - #{Generations[6].nationalDexEnd}</p>
				<p>{Regions.ALOLA}</p>
			</div>
			<div class="hintEntry">
				<p>#{Generations[6].nationalDexEnd + 1} - #{Generations[7].nationalDexEnd - 7}</p>
				<p>{Regions.GALAR}</p>
			</div>
			<div class="hintEntry">
				<p>#{Generations[7].nationalDexEnd - 6} - #{Generations[7].nationalDexEnd}</p>
				<p>{Regions.HISUI}</p>
			</div>
			<div class="hintEntry">
				<p>#{Generations[7].nationalDexEnd + 1} - #{Generations[8].nationalDexEnd}</p>
				<p>{Regions.PALDEA}</p>
			</div>
		</div>
	</div>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
	{#each AdjustedPokemonNames.slice(fromPokemon, fromPokemon + pokemonPageSize) as pokemon}
		<!-- <PokemonPreview {pokemon} /> -->
		<PokemonListEntry
			pokemon={{
				id: pokemon.id,
				gender: undefined,
				shiny: false,
				added: ''
			}}
		/>
	{/each}
</div>

<div class="columns mt-4">
	<div class="column flex content-center justify-center gap-4">
		<PageNavigator />
	</div>
</div>

<style>
	#hintButton {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}
	#jumpToText {
		/* padding-left: 2rem; */
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
		width: 150px;
		text-align: center;
	}
	#jumpToButton {
		border-bottom-left-radius: 0;
		border-top-left-radius: 0;
		min-width: fit-content;
	}

	.hintEntry {
		display: inline-flex;
		justify-content: space-between;
	}

	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		appearance: none;
	}
	input[type='number'] {
		appearance: textfield;
		-moz-appearance: textfield;
	}
</style>
