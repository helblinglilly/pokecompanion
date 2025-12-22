<script lang="ts">
	import type { APIPokemon } from '$/@types/api.pokecompanion';
	import { currentUser } from '$lib/stores/user';
	import SelectedTags from '$/ui/molecules/tags/SelectedTags.svelte';
	import Icon from '$/ui/atoms/Icon.svelte';
	import CreateNewTag from '$/ui/molecules/Collections/CreateNewTag.svelte';
	import EditTag from '$/ui/molecules/tags/EditTag.svelte';
	import Image from '$/ui/atoms/Image.svelte';
	import SpritePreview from './SpritePreview.svelte';
	import Pokedex from './Pokedex.svelte';
	import { tagStore } from '$/lib/stores/tags';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	interface Props {
		data: APIPokemon;
	}

	let { data }: Props = $props();

	let hasShinySprite = $derived(data.sprites.some((sprite) => sprite.hasShiny));
	let hasFemaleSprite = $derived(data.sprites.some((sprite) => sprite.hasFemale));

	const genderParam = page.url.searchParams.get('gender');
	const gender = genderParam === 'male' ? 'male' : genderParam === 'female' ? 'female' : undefined;

	const changeUrlQueryParam = (param: string, value: string) => {
		const newUrl = new URL(page.url);
		newUrl.searchParams.set(param, value);
		goto(newUrl.toString(), { noScroll: true, keepFocus: false });
	};

	const deleteUrlQueryParam = (param: string) => {
		const newUrl = new URL(page.url);
		newUrl.searchParams.delete(param);
		goto(newUrl.toString(), { noScroll: true, keepFocus: false });
	};
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
			<div class="w-full"></div>
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
		<SelectedTags
			pokemon={{
				id: data.id,
				hasFemaleSprite: hasFemaleSprite,
				showFemaleSpriteIfExists: gender === 'female',
				hasShinySprite: hasShinySprite,
				showShinySpriteIfExists: page.url.searchParams.get('shiny') === 'true',
				gender,
				variety: page.url.searchParams.get('variety') ?? undefined
			}}
		/>
	</div>
	<div class="flex justify-center items-center w-full gap-2 pt-2">
		{#if $tagStore.length > 0}
			<EditTag
				pokemon={{
					id: data.id,
					hasFemaleSprite: hasFemaleSprite,
					showFemaleSpriteIfExists: gender === 'female',
					hasShinySprite: hasShinySprite,
					showShinySpriteIfExists: page.url.searchParams.get('shiny') === 'true',
					gender,
					variety: page.url.searchParams.get('variety') ?? undefined
				}}
			/>
		{/if}

		<CreateNewTag
			pokemon={{
				id: data.id,
				gender: gender,
				shiny: page.url.searchParams.get('shiny') === 'true',
				variety: page.url.searchParams.get('variety') ?? undefined
			}}
		/>
	</div>
{/if}

{#if hasShinySprite}
	<button
		data-testid="shinyToggle"
		data-umami-event="PokemonShiny"
		class="triangle right"
		style={`border-bottom-color: #f0e45f;`}
		onclick={() => {
			const isOnShiny = page.url.searchParams.get('shiny') === 'true';

			if (isOnShiny) {
				deleteUrlQueryParam('shiny');
			} else {
				changeUrlQueryParam('shiny', 'true');
			}
		}}
	>
		{#if page.url.searchParams.get('shiny') === 'true'}
			<Icon name="spark-full" style="margin-top: 1.8rem; margin-left: -2rem;" />
		{:else}
			<Icon name="spark" style="margin-top: 1.8rem; margin-left: -2rem;" />
		{/if}
	</button>
{/if}

{#if hasFemaleSprite}
	<button
		data-testid="genderToggle"
		class="triangle left"
		data-umami-event="PokemonGender"
		style={`border-bottom-color: ${
			hasFemaleSprite && gender === 'female' ? '#f6abd9' : '#7fbbf0'
		};`}
		onclick={() => {
			const currentGender = gender === 'female' ? 'female' : 'male';

			if (currentGender === 'female') {
				deleteUrlQueryParam('gender');
			} else {
				changeUrlQueryParam('gender', 'female');
			}
		}}
	>
		{#if hasFemaleSprite}
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
