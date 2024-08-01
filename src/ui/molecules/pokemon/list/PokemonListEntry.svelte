<script lang="ts">
	import Image from '$/ui/atoms/image/Image.svelte';
	import { getMultiLanguageName } from '$lib/utils/language';
	import {
		animateSprites,
		primaryLanguage,
		secondaryLanguage,
		selectedGame,
		theme,
		versionSpecificPokemonSprites
	} from '$lib/stores/domain';
	import type { ITagPokemon } from '$lib/types/ITags';
	import { getPokemonEntry } from '$lib/data/games';
	import Icon from '$/components/UI/Icon.svelte';
	import { pokemonVarietyNameToDisplay } from '$lib/utils/string';
	import Card from '$/ui/atoms/card';

	export let pokemon: ITagPokemon;
	export let showRemoveButton: boolean = false;
	export let onRemoveClick = () => {};
	export let showGenderAndShiny: boolean = false;

	$: namePrefix = pokemonVarietyNameToDisplay(pokemon.variety ?? '');

	const queryParams = new URLSearchParams();
	$: {
		if (pokemon) {
			if (pokemon.gender) {
				queryParams.set('gender', pokemon.gender);
			} else {
				queryParams.delete('gender');
			}
			if (pokemon.shiny) {
				queryParams.set('shiny', 'true');
			} else {
				queryParams.delete('shiny');
			}
			if (pokemon.variety) {
				queryParams.set('variety', pokemon.variety);
			} else {
				queryParams.delete('variety');
			}
		}
	}

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

<Card
	classes="m-0 w-full"
	isClickable
	id={pokemon.id.toString()}
	style="position: relative; padding: 0.5rem;"
>
	<a href={`/pokemon/${pokemon.id}?${queryParams.toString()}`} class="clickable">
		<div>
			<div class="spriteWrapper">
				{#await getSpriteURL(showGenderAndShiny ? pokemon.shiny === true : false, showGenderAndShiny ? pokemon.gender === 'female' : false)}
					<Image
						src={`/placeholder.png`}
						alt={`sprite`}
						loading="lazy"
						height="96px"
						width="96px"
					/>
				{:then spriteURL}
					<Image
						classNames="ml-auto mr-auto h-full max-w-min"
						src={spriteURL}
						alt={`sprite`}
						loading="lazy"
						height="64px"
					/>
				{/await}
			</div>

			<p style="margin-top: auto; margin-bottom: auto;">
				#{pokemon.id}
				{getMultiLanguageName(
					getPokemonEntry(pokemon.id).names,
					$primaryLanguage,
					$secondaryLanguage,
					namePrefix
				)}
			</p>
		</div>

		<div>
			{#if showGenderAndShiny}
				{#if pokemon.gender === 'female'}
					<Icon
						name="venus"
						style={`fill: ${$theme === 'dark' ? '#f6abd9' : '#ee5db7'}; margin: auto;`}
					/>
				{:else if pokemon.gender === 'male'}
					<Icon
						name="mars"
						style={`fill: ${
							$theme === 'dark' ? '#99b3ff' : '#3366ff'
						}; margin: auto; margin-right: 0.5rem;`}
					/>
				{/if}

				{#if pokemon.shiny}
					{#if $theme === 'light'}
						<Icon
							name="spark"
							style="margin-top: 1.25rem"
							lineStroke="var(--text)"
							pathStroke="var(--text)"
						/>
					{:else}
						<Icon
							name="spark-full"
							style="margin-top: 1.25rem"
							pathFill="var(--text)"
							lineStroke="var(--text)"
							pathStroke="var(--text)"
						/>
					{/if}
				{/if}
			{/if}
		</div>
	</a>
	{#if showRemoveButton}
		<button class="removeButton" on:click={onRemoveClick}>-</button>
	{/if}
</Card>

<style>
	a {
		text-decoration-line: unset;
		display: inline-flex;
		align-items: center;
		width: 100%;
		justify-content: space-between;
	}

	a > div {
		display: inline-flex;
	}

	a > div:first-child {
		width: 80%;
	}

	a > div:last-child {
		justify-content: end;
		margin-right: 1rem;
	}

	.removeButton {
		position: absolute;
		top: 0;
		right: 0;
		text-align: center;
		height: 2rem;
		width: 2rem;
		border-radius: 10%;
		font-weight: bold;
		color: var(--light);
		background-color: var(--error);
		z-index: 5;
	}

	.spriteWrapper {
		height: 96px;
		width: 96px;
		padding: 1rem;
		align-content: center;
	}
</style>
