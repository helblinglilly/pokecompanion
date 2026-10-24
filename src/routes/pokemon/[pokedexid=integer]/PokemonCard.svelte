<script lang="ts">
	import type { APIPokemon } from '$/@types/api.pokecompanion';
	import { currentUser } from '#lib/stores/user.js';
	import Icon from '$/ui/atoms/Icon.svelte';
	import EditTag from '$/ui/molecules/tags/EditTag.svelte';
	import Image from '$/ui/atoms/Image.svelte';
	import SpritePreview from './SpritePreview.svelte';
	import Pokedex from './Pokedex.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import AttachedTags from '$/features/tags/AttachedTags.svelte';
	import type { LayoutData } from '../../$types';
	import CreateNewTag from '$/features/tags/new/CreateNewTag.svelte';
	import { isSprite } from '$/lib/utils/isSprite';
	import { selectedGame } from '$/lib/stores/domain';
	import { tracker } from '#lib/analytics/tracker.js';

	interface Props {
		data: APIPokemon;
	}

	let { data }: Props = $props();

	let hasShinySprite = $derived(data.sprites.some((sprite) => sprite.hasShiny));
	let hasFemaleSprite = $derived(data.sprites.some((sprite) => sprite.hasFemale));

	const layoutData = $derived(page.data) as LayoutData;

	const genderParam = page.url.searchParams.get('gender');
	const gender = genderParam === 'male' ? 'male' : genderParam === 'female' ? 'female' : undefined;

	const changeUrlQueryParam = (param: string, value: string) => {
		const newUrl = new URL(page.url.href);
		newUrl.searchParams.set(param, value);
		goto(newUrl.toString(), { reset: false });
	};

	const deleteUrlQueryParam = (param: string) => {
		const newUrl = new URL(page.url.href);
		newUrl.searchParams.delete(param);
		goto(newUrl.toString(), { reset: false });
	};
</script>

<div class="inline-flex w-full justify-between h-5">
	<div class="inline-flex gap-1 justify-start w-6/12">
		{#each data.types.own as type}
			<div>
				<Image
					src={type.icon}
					alt={type.name}
					isSprite={isSprite($selectedGame?.pokeapi)}
					classNames="pokemon-type-icon"
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
	<div class="pokemon-tag-actions flex justify-center items-center w-full gap-2 relative z-20">
		<AttachedTags
			pokemon={{
				id: data.id,
				gender,
				variety: page.url.searchParams.get('variety') ?? undefined,
				shiny: page.url.searchParams.get('shiny') === 'true'
			}}
		/>
	</div>
	<div class="flex justify-center items-center w-full gap-2 pt-2">
		{#if layoutData.tags.tags.length > 0}
			<EditTag
				pokemon={{
					id: data.id,
					shiny: page.url.searchParams.get('shiny') === 'true',
					gender,
					variety: page.url.searchParams.get('variety') ?? undefined
				}}
			/>
		{/if}

		<CreateNewTag
			contents={{
				pokemon: [
					{
						id: data.id,
						gender: gender,
						shiny: page.url.searchParams.get('shiny') === 'true',
						variety: page.url.searchParams.get('variety') ?? undefined
					}
				]
			}}
		/>
	</div>
{/if}

{#if hasShinySprite}
	<button
		aria-label="Toggle shiny appearance"
		aria-pressed={page.url.searchParams.get('shiny') === 'true'}
		data-testid="shinyToggle"
		data-umami-event="PokemonShiny"
		class="shiny-toggle"
		onclick={() => {
			const isOnShiny = page.url.searchParams.get('shiny') === 'true';

			if (isOnShiny) {
				deleteUrlQueryParam('shiny');
			} else {
				changeUrlQueryParam('shiny', 'true');
			}
			tracker.captureEvent('pokemon_shiny_toggled', {
				pokemon_id: data.id,
				is_shiny: !isOnShiny
			});
		}}
	>
		{#if page.url.searchParams.get('shiny') === 'true'}
			<Icon
				name="spark-full"
				viewBox="16 8 232 232"
				style="width: 1.5rem; height: 1.5rem; display: block; position: absolute; right: 0.5833rem; bottom: 0.5833rem;"
				pathStroke="currentColor"
				lineStroke="currentColor"
				pathFill="currentColor"
			/>
		{:else}
			<Icon
				name="spark"
				viewBox="16 8 232 232"
				style="width: 1.5rem; height: 1.5rem; display: block; position: absolute; right: 0.5833rem; bottom: 0.5833rem;"
				pathStroke="currentColor"
				lineStroke="currentColor"
				pathFill="currentColor"
			/>
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
			tracker.captureEvent('pokemon_gender_changed', {
				pokemon_id: data.id,
				gender: currentGender === 'female' ? 'male' : 'female'
			});
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

	.pokemon-tag-actions {
		flex-flow: wrap;
	}

	:global(.pokemon-type-icon) {
		height: 1.5rem;
		max-width: 5rem;
		object-fit: contain;
	}

	.shiny-toggle {
		position: absolute;
		right: 0;
		bottom: 0;
		width: 4rem;
		height: 4rem;
		border-bottom-right-radius: var(--radius-surface);
		clip-path: polygon(100% 0, 100% 100%, 0 100%);
		background: #f0e45f;
		color: #11181c;
		cursor: pointer;
	}
	.shiny-toggle:hover {
		background: #e5d643;
	}
	.shiny-toggle[aria-pressed='true'] {
		background: #e5c83d;
	}
	.shiny-toggle:focus-visible {
		outline: none;
		box-shadow: inset -3px -3px 0 var(--text);
	}

	.triangle.left {
		left: 0;
		border-bottom-left-radius: 10px;
		border-right: 4rem solid transparent;
		border-bottom: 4rem solid;
	}
</style>
