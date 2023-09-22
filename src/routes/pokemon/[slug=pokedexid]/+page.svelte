<script lang="ts">
	import PokemonNames from '$lib/data/pokemonNames.json';
	import { lastPokedexEntry, primaryLanguage, secondaryLanguage } from '$lib/domain';
	import { getMultiLanguageName } from '$lib/utils/language';
	import Sprite from '../../../components/GameSpecific/Sprite.svelte';
	import Navigator from '../../../components/Navigator.svelte';
	import { navigating, page } from '$app/stores';
	import { getPokemonPageData } from '$lib/pokemon-id/pokemonPage';
	import { getPokemonTypesInGame } from '$lib/data/elementalTypes';
	import EvolutionChain from '../../../components/EvolutionChain.svelte';

	$: if ($navigating) refetchData();

	export let data;
	$: pageData = data;

	const refetchData = async () => {
		const newPokemonId = Number($navigating?.to?.params?.slug ?? 1);

		getPokemonPageData(newPokemonId)
			.then((result) => {
				pageData.id = result.id;
				pageData.pokemon = result.pokemon;
				pageData.species = result.species;
			})
			.catch((err) => {
				console.log('error getting data', err);
			});
	};

	$: currentPokemonId = Number(
		$page.url.pathname.split('/')[$page.url.pathname.split('/').length - 1]
	);

	const removeLastRouteFromURL = (url: string) => {
		const parts = url.split('/');
		parts.pop();
		const modifiedURL = parts.join('/');
		return modifiedURL;
	};
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
				<div style="display: inline-flex;">
					{#each getPokemonTypesInGame(pageData.pokemon) as type}
						<img src={type.icon} alt={type.name} style="margin-right: 4px;" />
					{/each}
				</div>
				<p>Tags</p>
			</div>
			<Sprite sprites={pageData.pokemon.sprites} />
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
	<!--<div class="column">
		<div class="card">
			<p>1</p>
		</div>
	</div> -->
</div>
