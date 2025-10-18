<script lang="ts">
	import {
		lastPokedexEntry,
		primaryLanguage,
		secondaryLanguage,
		selectedGame
	} from '$lib/stores/domain';
	import { getMultiLanguageName } from '$lib/utils/language';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { currentUser } from '$lib/stores/user';
	import SelectedTags from '$/ui/molecules/tags/SelectedTags.svelte';
	import Icon from '$/ui/atoms/icon/Icon.svelte';
	import { page } from '$app/stores';
	import { pokemonDisplayStore } from '$lib/stores/pokemonPage';
	import CreateNewTag from '$/ui/molecules/Collections/Tags/CreateNewTag/CreateNewTag.svelte';
	import { tagStore } from '$lib/stores/tags';
	import EditTag from '$/ui/molecules/tags/EditTag.svelte';
	import SocialPreview from '$/lib/components/SocialPreview.svelte';
	import { Logger } from '$lib/log';
	import { isPokemonInGameGroup } from '$lib/data/games';
	import Card from '$/ui/atoms/card/Card.svelte';
	import TypeMatchup from './TypeMatchup.svelte';
	import BaseStats from './BaseStats.svelte';
	import MovesetCard from './MovesetCard.svelte';
	import Breadcrumbs from '$/lib/components/Breadcrumbs.svelte';
	import Abilities from './Abilities.svelte';
	import Encounters from './Encounters.svelte';
	import EvolutionChain from './EvolutionChain.svelte';
	import Pokedex from './Pokedex.svelte';
	import SpritePreview from './SpritePreview.svelte';
	import Navigator from './Navigator.svelte';
	import Image from '$/ui/atoms/image/Image.svelte';

	export let data;

	$: {
		if (data) {
			const showFemaleSpriteIfExists = $page.url.searchParams.get('gender') === 'female';
			const showShinySpriteIfExists = $page.url.searchParams.get('shiny') === 'true';
			const varietyName = $page.url.searchParams.get('variety');

			pokemonDisplayStore.set({
				id: data.id,
				showFemaleSpriteIfExists,
				hasFemaleSprite: data.sprites.some((sprite) => sprite.hasFemale),
				gender: data.sprites.some((sprite) => sprite.hasFemale)
					? showFemaleSpriteIfExists
						? 'female'
						: 'male'
					: undefined,
				showShinySpriteIfExists,
				hasShinySprite: data.sprites.some((sprite) => sprite.hasShiny),
				variety: varietyName ?? data.pokemon.name + '-default',
				transferableQueryParams: '' // Gets auto-updated within the store anyway
			});

			tagStore.set(data.tags);
		}
	}

	const changeUrlQueryParam = (param: string, value: string) => {
		const newUrl = new URL($page.url);
		newUrl.searchParams.set(param, value);
		goto(newUrl.toString(), { replaceState: true, noScroll: true });
	};

	const deleteUrlQueryParam = (param: string) => {
		const newUrl = new URL($page.url);
		newUrl.searchParams.delete(param);
		goto(newUrl.toString(), { replaceState: true, noScroll: true });
	};

	$: {
		if (
			$pokemonDisplayStore.showFemaleSpriteIfExists !==
			($page.url.searchParams.get('gender') === 'female')
		) {
			changeUrlQueryParam(
				'gender',
				$pokemonDisplayStore.showFemaleSpriteIfExists ? 'female' : 'male'
			);
		}
	}

	$: {
		if (
			$pokemonDisplayStore.showShinySpriteIfExists !==
			($page.url.searchParams.get('shiny') === 'true')
		) {
			if ($pokemonDisplayStore.showShinySpriteIfExists) {
				changeUrlQueryParam('shiny', 'true');
			} else {
				deleteUrlQueryParam('shiny');
			}
		}
	}

	onMount(() => {
		document.addEventListener('keydown', (e) => {
			if (e.key === 'ArrowLeft' && data.id > 1) {
				goto(`/pokemon/${data.id - 1}`);
			} else if (e.key === 'ArrowRight' && data.id < lastPokedexEntry) {
				goto(`/pokemon/${data.id + 1}`);
			}
		});
	});

	const filename = (shiny: string | null, gender: string | null) => {
		if (shiny === 'true') {
			if (gender === 'male') {
				return 'shiny-male';
			} else if (gender === 'female') {
				return 'shiny-female';
			}
			return 'shiny';
		}
		if (gender === 'male') {
			return 'male';
		} else if (gender === 'female') {
			return 'female';
		}
		return 'generic';
	};

	const englishPokedexEntries = data.pokedexEntries.filter((entry) => entry.language === 'en');
</script>

<SocialPreview
	title={`${getMultiLanguageName(data.species?.names, $primaryLanguage, $secondaryLanguage)}`}
	previewImage={`https://socialpreviews.pokecompanion.helbling.uk/pokemon/${data.id}-${filename(
		$page.url.searchParams.get('shiny'),
		$page.url.searchParams.get('gender')
	)}.png`}
	description={englishPokedexEntries?.length > 0
		? englishPokedexEntries[englishPokedexEntries.length - 1]?.textEntry
		: `View ${getMultiLanguageName(
				data.species.names,
				'en',
				undefined
		  )}'s evolutions, abilities, moves and more!'`}
/>
<Breadcrumbs
	breadcrumbs={[
		{ display: 'Pokémon', url: `/pokemon?jumpTo=${data.id}` },
		{ display: `${data.id}` }
	]}
/>

<div class="grid gap-4">
	<Navigator
		title={`${getMultiLanguageName(data.species.names, $primaryLanguage, $secondaryLanguage)}`}
		currentId={data.id}
		forms={data.pokemon.varietyForms}
	/>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<Card classes="relative min-h-[250px] h-fit">
			<div class="inline-flex w-full justify-between h-5">
				<div class="inline-flex gap-1 justify-start w-6/12">
					{#each data.types.own as type}
						<div>
							<Image
								src={type.icon}
								alt={type.name}
								style={'h-6 object-fit: contain; max-width: 5rem;'}
							/>
						</div>
					{/each}
					{#if data.pokemon.types.length === 1}
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
				<div
					class="flex justify-center items-center w-full gap-2 relative z-20"
					style="flex-flow: wrap;"
				>
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
							shiny:
								$pokemonDisplayStore.hasShinySprite && $pokemonDisplayStore.showShinySpriteIfExists,
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
						$pokemonDisplayStore.showShinySpriteIfExists =
							!$pokemonDisplayStore.showShinySpriteIfExists;
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
						<Icon
							name="venus"
							style="margin-top: 2.1rem; margin-left: 0.6rem; fill: var(--dark);"
						/>
					{:else}
						<Icon name="mars" style="margin-top: 2.1rem; margin-left: 0.5rem; fill: var(--dark);" />
					{/if}
				</button>
			{/if}
		</Card>

		<Card>
			<h3 class="h3 mb-4">Evolutions</h3>
			<EvolutionChain evolutionChainUrl={data.species.evolution_chain.url} />
		</Card>

		<Card>
			<h3 class="h3 mb-4">Type matchup</h3>
			<TypeMatchup types={data.types} />
		</Card>

		<Card>
			<h3 class="h3 mb-4">Base stats</h3>
			<BaseStats data={data.pokemon.stats} />
		</Card>

		<Card>
			<h3 class="h3">Encounters</h3>
			<Encounters encounterData={data.encounters} />
		</Card>

		<Card>
			<h3 class="h3 mb-4">Abilities</h3>
			<Abilities abilities={data.pokemon.abilities} />
		</Card>
	</div>

	<Card>
		<h3 class="h3">Moveset</h3>
		<MovesetCard movesetData={data.pokemon.moves} />
	</Card>
</div>

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
