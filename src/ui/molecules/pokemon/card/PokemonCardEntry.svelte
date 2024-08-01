<script lang="ts">
	import { getMultiLanguageName } from '$lib/utils/language';
	import { primaryLanguage, secondaryLanguage, theme } from '$lib/stores/domain';
	import type { ITagPokemon } from '$lib/types/ITags';
	import { getPokemonEntry } from '$lib/data/games';
	import Icon from '$/components/UI/Icon.svelte';
	import { pokemonVarietyNameToDisplay } from '$lib/utils/string';
	import Card from '$/ui/atoms/card/Card.svelte';
	import Sprite from '$/ui/atoms/pokemon/sprite/Sprite.svelte';

	export let pokemon: ITagPokemon;
	export let showRemoveButton: boolean;
	export let showGenderAndShiny: boolean;
	export let onRemoveClick: () => void = () => null;
	export let style: string = '';

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
</script>

<Card
	id={pokemon.id.toString()}
	isClickable
	style={`${style} position: relative; min-height: 150px; height: auto; padding: 0;`}
>
	<a href={`/pokemon/${pokemon.id}?${queryParams.toString()}`} class="clickable w-full h-full">
		<div class="spriteWrapper">
			<Sprite {...pokemon} female={pokemon.gender === 'female'} />
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

	<div class="indicators">
		{#if showGenderAndShiny && pokemon.gender === 'female'}
			<Icon
				name="venus"
				style={`margin-top: auto; margin-bottom: auto; padding-left: 10px; fill: ${
					$theme === 'dark' ? '#f6abd9' : '#ee5db7'
				};`}
			/>
		{:else if showGenderAndShiny && pokemon.gender === 'male'}
			<Icon
				name="mars"
				style={`margin-top: auto; margin-bottom: auto; padding-left: 10px; fill: ${
					$theme === 'dark' ? '#99b3ff' : '#3366ff'
				};`}
			/>
		{/if}

		{#if showGenderAndShiny && pokemon.shiny}
			{#if $theme === 'light'}
				<Icon
					name="spark"
					style="margin-top: 0.2rem;"
					lineStroke="var(--text)"
					pathStroke="var(--text)"
				/>
			{:else}
				<Icon
					style="margin-top: 0.2rem;"
					name="spark-full"
					pathFill="var(--text)"
					lineStroke="var(--text)"
					pathStroke="var(--text)"
				/>
			{/if}
		{/if}

		{#if showRemoveButton}
			<button class="removeButton mr-4" on:click={onRemoveClick}>-</button>
		{/if}
	</div>
</Card>

<style>
	a {
		text-decoration-line: unset;
		border-radius: 10px;
		display: block;
		height: 100%;
		padding: 2rem;
	}

	a > p {
		text-align: center;
		position: relative;
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
		z-index: 1;
	}

	.indicators {
		position: absolute;
		top: 0;
		left: 0;
		text-align: center;
		height: 2rem;
		width: 100%;
		border-radius: 10%;
		z-index: 1;
		display: inline-flex;
		margin: 0.5rem;
		gap: 0.5rem;
	}

	.spriteWrapper {
		height: 96px;
		width: 96px;
		margin-left: auto;
		margin-right: auto;
		align-content: center;
	}

	p {
		word-wrap: normal;
	}
</style>
