<script lang="ts">
	import { getLanguageEntry } from '$lib/utils/language';
	import { primaryLanguage, secondaryLanguage, selectedGame, theme } from '$lib/stores/domain';
	import { getPokemonEntry, type IGameGroups } from '$lib/data/games';
	import Icon from '$/ui/atoms/icon/Icon.svelte';
	import { pokemonVarietyNameToDisplay } from '$lib/utils/string';
	import Card from '$/ui/atoms/card/Card.svelte';
	import Image from '$/ui/atoms/image';
	import type { IRecordPokemon } from '$/lib/types/IPokemon';
	import { createEventDispatcher, onMount } from 'svelte';
	import { getSpriteURL } from '$/ui/atoms/pokemon/sprite/helper';

	export let pokemon: IRecordPokemon;
	export let showGenderAndShiny: boolean;
	export let isClickable: boolean = true;
	export let gameOverride: IGameGroups | undefined = undefined;

	const dispatch = createEventDispatcher();

	$: namePrefix = pokemonVarietyNameToDisplay(pokemon.variety ?? '');
	$: primaryName = getLanguageEntry(getPokemonEntry(pokemon.id).names, $primaryLanguage);
	$: secondaryName = $secondaryLanguage
		? getLanguageEntry(getPokemonEntry(pokemon.id).names, $secondaryLanguage)
		: undefined;

	let spriteURL: string | null = null;

	let isMounted = false;
	onMount(() => {
		isMounted = true;
	});
	$: {
		const fetchSpriteURL = async () => {
			spriteURL = await getSpriteURL(
				pokemon.id,
				showGenderAndShiny ? pokemon.shiny === true : false,
				showGenderAndShiny ? pokemon.gender === 'female' : false,
				pokemon.variety,
				gameOverride ?? $selectedGame
			);
		};
		if (isMounted) {
			fetchSpriteURL();
		}
	}
</script>

<Card
	id={pokemon.id.toString()}
	{isClickable}
	classes="relative h-auto p-8 text-center"
	style={`min-height: 150px;`}
	on:click={() => {
		dispatch('click', pokemon);
	}}
>
	<div class="spriteWrapper">
		{#if spriteURL}
			<Image
				classNames="ml-auto mr-auto h-full max-w-min"
				src={spriteURL}
				alt={`sprite`}
				loading="lazy"
				height="64px"
			/>
		{:else}
			<div />
		{/if}
	</div>
	<p>#{pokemon.id}{namePrefix ? ' ' + namePrefix : ''}</p>
	{#if primaryName}
		<p>{primaryName}</p>
	{/if}
	{#if secondaryName}
		<p>{secondaryName}</p>
	{/if}

	<div class="indicators">
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

		{#if showGenderAndShiny && pokemon.gender === 'female'}
			<Icon
				name="venus"
				style={`margin-top: 0.5rem; fill: ${$theme === 'dark' ? '#f6abd9' : '#ee5db7'};`}
			/>
		{:else if showGenderAndShiny && pokemon.gender === 'male'}
			<Icon
				name="mars"
				style={`margin-top: 0.5rem; margin-bottom: auto; fill: ${
					$theme === 'dark' ? '#99b3ff' : '#3366ff'
				};`}
			/>
		{/if}

		<slot name="remove" />
	</div>
</Card>

<style>
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
		margin: 0;
		padding: 0.5rem;
		padding-left: 1rem;
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
