<script lang="ts">
	import type { APIPokemon } from '$/@types/api.pokecompanion';
	import { Logger } from '$lib/log';
	import { isPokemonInGameGroup } from '$lib/data/games';
	import { currentUser } from '$lib/stores/user';
	import SelectedTags from '$/ui/molecules/tags/SelectedTags.svelte';
	import Icon from '$/ui/atoms/icon/Icon.svelte';
	import { selectedGame } from '$lib/stores/domain';
	import CreateNewTag from '$/ui/molecules/Collections/Tags/CreateNewTag/CreateNewTag.svelte';
	import EditTag from '$/ui/molecules/tags/EditTag.svelte';
	import Image from '$/ui/atoms/image/Image.svelte';
	import SpritePreview from './SpritePreview.svelte';
	import Pokedex from './Pokedex.svelte';
	import { pokemonDisplayStore } from '$/lib/stores/pokemonPage';
	import { tagStore } from '$/lib/stores/tags';

	export let data: APIPokemon;
</script>

<div class="inline-flex w-full justify-between h-5">
	<div class="inline-flex gap-1 justify-start w-6/12">
		{#each data.types.own as type}
			<div>
				<Image
					src={type.icon}
					alt={type.name}
					style={'height: 1.5rem; object-fit: contain; max-width: 5rem;'}
				/>
			</div>
		{/each}
		{#if data.types.own.length === 1}
			<div class="w-full" />
		{/if}
	</div>

	<Pokedex
		pokedexEntries={data.pokedexEntries}
		height={data.height}
		weight={data.weight}
		cry={data.cry}
	/>
</div>

<SpritePreview sprites={data.sprites} />

{#if $currentUser}
	<div class="flex justify-center items-center w-full gap-2 relative z-20" style="flex-flow: wrap;">
		<SelectedTags pokemon={$pokemonDisplayStore} />
	</div>
	<div class="flex justify-center items-center w-full gap-2 pt-2">
		{#if $tagStore.length > 0}
			<EditTag pokemon={$pokemonDisplayStore} />
		{/if}

		<CreateNewTag
			pokemon={{
				id: data.id,
				gender: $pokemonDisplayStore.gender,
				shiny: $pokemonDisplayStore.hasShinySprite && $pokemonDisplayStore.showShinySpriteIfExists,
				variety: $pokemonDisplayStore.variety
			}}
		/>
	</div>
{/if}

{#if !isPokemonInGameGroup(data.id, $selectedGame)}
	<p style="text-align: center; margin-top: 20px;">Pokémon is not present in game</p>
{/if}

{#if $pokemonDisplayStore.hasShinySprite}
	<button
		data-testid="shinyToggle"
		class="triangle right"
		style={`border-bottom-color: ${
			$pokemonDisplayStore.showShinySpriteIfExists ? '#f0e45f' : '#f0e45f'
		}`}
		on:click={() => {
			Logger.addPageAction('UIInteraction', 'SpriteShiny', {
				action: 'Sprite Change'
			});
			$pokemonDisplayStore.showShinySpriteIfExists = !$pokemonDisplayStore.showShinySpriteIfExists;
		}}
	>
		{#if $pokemonDisplayStore.showShinySpriteIfExists}
			<Icon name="spark-full" style="margin-top: 1.8rem; margin-left: -2rem;" />
		{:else}
			<Icon name="spark" style="margin-top: 1.8rem; margin-left: -2rem;" />
		{/if}
	</button>
{/if}

{#if $pokemonDisplayStore.hasFemaleSprite}
	<button
		data-testid="genderToggle"
		class="triangle left"
		style={`border-bottom-color: ${
			$pokemonDisplayStore.hasFemaleSprite && $pokemonDisplayStore.showFemaleSpriteIfExists
				? '#f6abd9'
				: '#7fbbf0'
		};`}
		on:click={() => {
			Logger.addPageAction('UIInteraction', 'SpriteGender', {
				action: 'Sprite Change'
			});

			$pokemonDisplayStore.showFemaleSpriteIfExists =
				!$pokemonDisplayStore.showFemaleSpriteIfExists;
		}}
	>
		{#if $pokemonDisplayStore.showFemaleSpriteIfExists}
			<Icon name="venus" style="margin-top: 2.1rem; margin-left: 0.6rem; fill: var(--dark);" />
		{:else}
			<Icon name="mars" style="margin-top: 2.1rem; margin-left: 0.5rem; fill: var(--dark);" />
		{/if}
	</button>
{/if}

<style>
	.triangle {
		position: absolute;
		bottom: 0;
		width: 0;
		height: 0;
		z-index: 0;
	}
	.triangle:hover {
		background-color: inherit;
	}

	.triangle.right {
		right: 0;
		border-bottom-right-radius: 10px;
		border-left: 4rem solid transparent;
		border-bottom: 4rem solid;
	}

	.triangle.left {
		left: 0;
		border-bottom-left-radius: 10px;
		border-right: 4rem solid transparent;
		border-bottom: 4rem solid;
	}
</style>
