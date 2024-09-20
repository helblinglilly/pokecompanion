<script lang="ts">
	import { getMultiLanguageName } from '$lib/utils/language';
	import { primaryLanguage, secondaryLanguage, theme } from '$lib/stores/domain';
	import { getPokemonEntry, type IGameGroups } from '$lib/data/games';
	import Icon from '$/ui/atoms/icon/Icon.svelte';
	import { pokemonVarietyNameToDisplay } from '$lib/utils/string';
	import Card from '$/ui/atoms/card';
	import type { IRecordPokemon } from '$/lib/types/IPokemon';
	import { createEventDispatcher, onMount } from 'svelte';
	import Sprite from '$/ui/atoms/pokemon/sprite/Sprite.svelte';

	export let pokemon: IRecordPokemon;
	export let showGenderAndShiny = false;
	export let gameOverride: IGameGroups | undefined = undefined;

	const dispatch = createEventDispatcher();

	$: namePrefix = pokemonVarietyNameToDisplay(pokemon.variety ?? '');

	export let cardActiveState = false;
</script>

<Card
	ariaLabel={getMultiLanguageName(
		getPokemonEntry(pokemon.id).names,
		$primaryLanguage,
		$secondaryLanguage,
		namePrefix
	)}
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
		<Sprite {...pokemon} {gameOverride} />

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

	<div class="mr-4 content-center inline-flex">
		{#if showGenderAndShiny}
			{#if pokemon.shiny}
				{#if $theme === 'light'}
					<Icon
						name="spark"
						style="margin-top: 2rem"
						lineStroke="var(--text)"
						pathStroke="var(--text)"
					/>
				{:else}
					<Icon
						name="spark-full"
						style="margin-top: 2rem"
						pathFill="var(--text)"
						lineStroke="var(--text)"
						pathStroke="var(--text)"
					/>
				{/if}
			{/if}

			{#if pokemon.gender === 'female'}
				<Icon
					name="venus"
					style={`fill: ${$theme === 'dark' ? '#f6abd9' : '#ee5db7'}; margin-top: 2.3rem;`}
				/>
			{:else if pokemon.gender === 'male'}
				<Icon
					name="mars"
					style={`fill: ${$theme === 'dark' ? '#99b3ff' : '#3366ff'}; margin: auto;`}
				/>
			{:else}
				<div style="width: 1rem;" />
			{/if}
		{/if}
	</div>
	<slot name="remove" />
</Card>
