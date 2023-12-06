<script lang="ts">
	import PokemonNames from '$lib/data/pokemonNames.json';
	import {
		lastPokedexEntry,
		primaryLanguage,
		secondaryLanguage,
		selectedGame
	} from '$lib/stores/domain';
	import { getMultiLanguageName } from '$lib/utils/language';
	import Sprite from '$components/GameSpecific/Sprite.svelte';
	import Navigator from '$components/Navigator.svelte';
	import { getPokemonTypesInGame } from '$lib/data/generationAdjuster.js';
	import EvolutionChain from '$components/Pokemon/EvolutionChain.svelte';
	import Image from '$components/Image.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { isPokemonInGame } from '$lib/data/games';
	import Pokedex from '$components/Pokedex.svelte';
	import { currentUser } from '$lib/stores/user';
	import SelectedTags from '$components/Tags/SelectedTags.svelte';
	import Breadcrumbs from '$components/Breadcrumbs.svelte';

	export let data;
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
			if (e.key === 'ArrowLeft' && data.id > 1) {
				goto(`/pokemon/${data.id - 1}`);
			} else if (e.key === 'ArrowRight' && data.id < lastPokedexEntry) {
				goto(`/pokemon/${data.id + 1}`);
			}
		});
	});
</script>

<svelte:head>
	<title
		>#{data.id}
		{`${getMultiLanguageName(
			PokemonNames[data.id - 1].names,
			$primaryLanguage,
			$secondaryLanguage
		)}`}</title
	>
</svelte:head>

<Breadcrumbs
	breadcrumbs={[
		{ display: 'Pokémon', url: `/pokemon?jumpTo=${data.id}` },
		{ display: `${data.id}` }
	]}
/>

<Navigator
	title={`${getMultiLanguageName(
		PokemonNames[data.id - 1].names,
		$primaryLanguage,
		$secondaryLanguage
	)}`}
	currentId={data.id}
	maxId={lastPokedexEntry}
	iconUrl={removeLastRouteFromURL(data.pokemon.sprites.front_default)}
	route="/pokemon"
/>

<div class="columns">
	<div class="column">
		<div class="card" style="padding-top: 1rem;">
			<div style="height: 20px; display: inline-flex; width: 100%; justify-content: space-between;">
				<div style="display: inline-flex; height: 20px; width: 150px;">
					{#each getPokemonTypesInGame(data.pokemon, $selectedGame?.generation) as type}
						<Image src={type.icon} alt={type.name} style="margin-right: 4px; width: 50px;" />
					{/each}
				</div>
				<Pokedex flavourTextEntries={data.species.flavor_text_entries} />
			</div>
			<Sprite sprites={data.pokemon.sprites} />
			{#if $currentUser}
				<SelectedTags
					newTagInitialContent={{ pokemon: [{ id: data.id, added: new Date().toISOString() }] }}
				/>
			{/if}
			{#if !isPokemonInGame(data.id, $selectedGame)}
				<p style="text-align: center; margin-top: 20px;">Pokémon is not present in game</p>
			{/if}
		</div>
	</div>
	<div class="column">
		<div class="card" id="evolutions">
			<EvolutionChain evolutionChainUrl={data.species.evolution_chain.url} />
		</div>
	</div>
</div>
