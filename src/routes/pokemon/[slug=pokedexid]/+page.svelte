<script lang="ts">
	import PokemonNames from '$lib/data/pokemonNames.json';
	import { lastPokedexEntry, primaryLanguage, secondaryLanguage } from '$lib/domain';
	import { getMultiLanguageName } from '$lib/utils/language';
	import Navigator from '../../../components/Navigator.svelte';
	export let data;

	const removeLastRouteFromURL = (url: string) => {
		const parts = url.split('/');
		parts.pop();
		const modifiedURL = parts.join('/');
		return modifiedURL;
	};
</script>

<Navigator
	title={`${getMultiLanguageName(
		PokemonNames[Number(data.slug) - 1].names,
		$primaryLanguage,
		$secondaryLanguage
	)}`}
	currentId={Number(data.slug)}
	maxId={lastPokedexEntry}
	iconUrl={removeLastRouteFromURL(data.pokemon.sprites.front_default)}
	route="/pokemon"
/>

<div class="columns">
	<div class="column">
		<div class="card">
			<p />
		</div>
	</div>
	<div class="column">
		<div class="card">
			<p>1</p>
		</div>
	</div>
	<div class="column">
		<div class="card">
			<p>1</p>
		</div>
	</div>
</div>
