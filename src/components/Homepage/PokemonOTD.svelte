<script lang="ts">
	import { getMultiLanguageName } from '$lib/utils/language';
	import Image from '$/components/UI/Image.svelte';
	import {
		animateSprites,
		primaryLanguage,
		secondaryLanguage,
		selectedGame,
		versionSpecificPokemonSprites
	} from '$lib/stores/domain';
	import type { ITagPokemon } from '$lib/types/ITags';
	import { getPokemonEntry } from '$lib/data/games';
	import { pokemonVarietyNameToDisplay } from '$lib/utils/string';

	export let pokemon: ITagPokemon;
	export let style: string = '';

	const namePrefix = pokemonVarietyNameToDisplay(pokemon.variety ?? '');

	const queryParams = new URLSearchParams();

	const fallbackSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

	async function getSpriteURL(shiny: boolean, isFemale: boolean) {
		const queryParamsCopy = new URLSearchParams(queryParams.toString());
		queryParamsCopy.set('shiny', `${shiny}`);
		queryParamsCopy.set('gender', isFemale ? 'female' : '');

		if ($versionSpecificPokemonSprites === true && $selectedGame) {
			queryParamsCopy.set('game', $selectedGame.pokeapi);

			if ($animateSprites) {
				queryParamsCopy.set('animate', $animateSprites ? 'true' : 'false');
			}
		}

		const res = await fetch(`/api/pokemon/${pokemon.id}/sprite?${queryParamsCopy.toString()}`);
		if (res.ok) {
			return await res.text();
		}
		return fallbackSpriteUrl;
	}
</script>

<div class="card" id={`${pokemon.id}`}>
	<a href={`/pokemon/${pokemon.id}?${queryParams.toString()}`} class="clickable">
		<div class="spriteWrapper">
			{#await getSpriteURL(false, false)}
				<Image src={'/placeholder.png'} alt={`sprite`} loading="lazy" height="96px" width="96px" />
			{:then spriteURL}
				<Image
					classNames="ml-auto mr-auto"
					src={spriteURL}
					alt={`sprite`}
					loading="lazy"
					height="96px"
					width="auto"
				/>
			{/await}
		</div>
		<p>#{pokemon.id}</p>
		<p>
			{getMultiLanguageName(
				getPokemonEntry(pokemon.id).names,
				$primaryLanguage,
				$secondaryLanguage,
				namePrefix
			)}
		</p>
	</a>
</div>

<style>
	a {
		text-decoration-line: unset;
		border-radius: 10px;
		display: block;
		height: 100%;
		width: 100%;
		padding: 2rem;
	}

	a > p {
		text-align: center;
		position: relative;
	}

	.card {
		position: relative;
		text-decoration: none;
	}

	.spriteWrapper {
		height: 96px;
		width: 96px;
		margin-left: auto;
		margin-right: auto;
		align-content: center;
	}
</style>
