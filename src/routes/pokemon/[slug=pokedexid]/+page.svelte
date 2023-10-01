<script lang="ts">
	import PokemonNames from '$lib/data/pokemonNames.json';
	import {
		lastPokedexEntry,
		primaryLanguage,
		secondaryLanguage,
		selectedGame
	} from '$lib/stores/domain';
	import { getMultiLanguageName } from '$lib/utils/language';
	import Sprite from '../../../components/GameSpecific/Sprite.svelte';
	import Navigator from '../../../components/Navigator.svelte';
	import { navigating, page } from '$app/stores';
	import { getPokemonPageData } from '$lib/pokemon-id/pokemonPage';
	import { getPokemonTypesInGame } from '$lib/data/elementalTypes';
	import EvolutionChain from '../../../components/EvolutionChain.svelte';
	import Image from '../../../components/Image.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { emptySprites } from '$lib/types/IPokemon';
	import { isPokemonInGame } from '$lib/data/games';
	import Pokedex from '../../../components/Pokedex.svelte';

	$: if ($navigating) refetchData();

	export let data;
	$: pageData = data;

	const refetchData = async () => {
		// Effectively handle the unmount state until new data is loaded
		const newPokemonId = Number($navigating?.to?.params?.slug ?? 1);
		pageData.pokemon.sprites = emptySprites(newPokemonId);
		pageData.pokemon.types = [];
		pageData.pokemon.past_types = [];

		getPokemonPageData(newPokemonId)
			.then((result) => {
				// Now that we have new data, populate it accordingly
				pageData.id = result.id;
				pageData.pokemon = result.pokemon;
				pageData.species = result.species;
			})
			.catch((err) => {
				console.log('error getting data', err);
			});
	};

	$: currentPokemonId = Number(
		$navigating?.to?.params?.slug ??
			Number($page.url.pathname.split('/')[$page.url.pathname.split('/').length - 1])
	);
	const removeLastRouteFromURL = (url: string) => {
		if (!url) {
			return;
		}
		const parts = url.split('/');
		parts.pop();
		const modifiedURL = parts.join('/');
		return modifiedURL;
	};

	onMount(() => {
		document.addEventListener('keydown', (e) => {
			if (e.key === 'ArrowLeft' && currentPokemonId > 1) {
				goto(`/pokemon/${currentPokemonId - 1}`);
			} else if (e.key === 'ArrowRight' && currentPokemonId < lastPokedexEntry) {
				goto(`/pokemon/${currentPokemonId + 1}`);
			}
		});
	});
</script>

<Navigator
	title={`${getMultiLanguageName(
		PokemonNames[currentPokemonId - 1].names,
		$primaryLanguage,
		$secondaryLanguage
	)}`}
	currentId={currentPokemonId}
	maxId={lastPokedexEntry}
	iconUrl={removeLastRouteFromURL(pageData.pokemon.sprites.front_default)}
	route="/pokemon"
/>

<div class="columns">
	<div class="column">
		<div class="card" style="padding-top: 1rem;">
			<div style="height: 20px; display: inline-flex; width: 100%; justify-content: space-between;">
				<div style="display: inline-flex; height: 20px; width: 150px;">
					{#each getPokemonTypesInGame(pageData.pokemon) as type}
						<Image src={type.icon} alt={type.name} style="margin-right: 4px; width: 50px;" />
					{/each}
				</div>

				<Pokedex flavourTextEntries={pageData.species.flavor_text_entries} />
			</div>
			<Sprite sprites={pageData.pokemon.sprites} />
			{#if !isPokemonInGame(currentPokemonId, $selectedGame ?? '')}
				<p style="text-align: center; margin-top: 20px;">Pokémon is not present in game</p>
			{/if}
		</div>
	</div>
	<div class="column">
		<div class="card">
			<EvolutionChain
				evolutionChainUrl={pageData.species.evolution_chain.url}
				id={currentPokemonId}
			/>
		</div>
	</div>
</div>
