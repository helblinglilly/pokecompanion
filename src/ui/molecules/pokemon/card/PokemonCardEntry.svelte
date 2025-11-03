<script lang="ts">
	import { selectedGame, theme, versionSpecificPokemonSprites } from '$lib/stores/domain';
	import Icon from '$/ui/atoms/icon/Icon.svelte';
	import Card from '$/ui/atoms/card/Card.svelte';
	import Image from '$/ui/atoms/image';
	import type { IRecordPokemon } from '$/lib/types/IPokemon';
	import { createEventDispatcher, onMount } from 'svelte';
	import { PUBLIC_API_HOST } from '$env/static/public';
	import type { APIPokemon } from '$/@types/api.pokecompanion';

	export let pokemon: IRecordPokemon;
	export let showGenderAndShiny: boolean;
	export let isClickable = true;

	const dispatch = createEventDispatcher();

	let fullPokemon: APIPokemon | null = null;

	onMount(async () => {
		const pokemonRequestUrl = new URL(`${PUBLIC_API_HOST}/pokemon/${pokemon.id}`);
		if (showGenderAndShiny) {
			pokemonRequestUrl.searchParams.append('shiny', `${pokemon.shiny}`);
			pokemonRequestUrl.searchParams.append('gender', `${pokemon.gender}`);
		}
		if (pokemon.variety) {
			pokemonRequestUrl.searchParams.append('variety', `${pokemon.variety}`);
		}

		if ($selectedGame && $versionSpecificPokemonSprites) {
			pokemonRequestUrl.searchParams.append('game', `${$selectedGame.pokeapi}`);
			pokemonRequestUrl.searchParams.append('versionSpecificPokemonSprites', `true`);
		}

		const res = await fetch(pokemonRequestUrl, {
			credentials: 'include'
		});

		fullPokemon = await res.json();
	});
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
		{#if fullPokemon?.sprites && fullPokemon.sprites[0]}
			<Image
				classNames="ml-auto mr-auto h-full max-w-min"
				src={fullPokemon.sprites[0].url}
				alt={fullPokemon.sprites[0].alt}
				loading="lazy"
				height="64px"
			/>
		{:else}
			<div />
		{/if}
	</div>
	<p>#{pokemon.id}</p>
	{#if fullPokemon?.name}
		<p>{fullPokemon.name}</p>
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
