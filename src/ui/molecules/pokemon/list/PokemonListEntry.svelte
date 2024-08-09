<script lang="ts">
	import Image from '$/ui/atoms/image/Image.svelte';
	import { getMultiLanguageName } from '$lib/utils/language';
	import { primaryLanguage, secondaryLanguage, selectedGame, theme } from '$lib/stores/domain';
	import { getPokemonEntry, type IGameGroups } from '$lib/data/games';
	import Icon from '$/components/UI/Icon.svelte';
	import { pokemonVarietyNameToDisplay } from '$lib/utils/string';
	import Card from '$/ui/atoms/card';
	import { getSpriteURL } from '$/ui/atoms/pokemon/sprite/helper';
	import type { IRecordPokemon } from '$/lib/types/IPokemon';
	import { createEventDispatcher } from 'svelte';

	export let pokemon: IRecordPokemon;
	export let showGenderAndShiny: boolean = false;
	export let gameOverride: IGameGroups | undefined = undefined;

	const dispatch = createEventDispatcher();

	$: namePrefix = pokemonVarietyNameToDisplay(pokemon.variety ?? '');

	export let cardActiveState = false;
</script>

<Card
	classes="m-0 w-full inline-flex justify-between"
	isClickable
	id={pokemon.id.toString()}
	style={`position: relative; padding: 0.5rem; ${
		cardActiveState ? 'background-color: var(--card-hover);' : ''
	}`}
	on:click={() => {
		dispatch('click', pokemon);
		cardActiveState = true;
	}}
>
	<div class="inline-flex">
		<div class="spriteWrapper">
			{#await getSpriteURL(pokemon.id, showGenderAndShiny ? pokemon.shiny === true : false, showGenderAndShiny ? pokemon.gender === 'female' : false, pokemon.variety, gameOverride ?? $selectedGame)}
				<Image src={`/placeholder.png`} alt={`sprite`} loading="lazy" height="96px" width="96px" />
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

	<div class="mr-4 content-center">
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

	<slot name="remove" />
</Card>

<style>
	.spriteWrapper {
		height: 96px;
		width: 96px;
		padding: 1rem;
		align-content: center;
	}
</style>
