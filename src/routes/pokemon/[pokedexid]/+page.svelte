<script lang="ts">
	import {
		lastPokedexEntry,
		primaryLanguage,
		secondaryLanguage,
		selectedGame
	} from '$lib/stores/domain';
	import { getMultiLanguageName } from '$lib/utils/language';
	import Navigator from '$/components/Navigator.svelte';
	import EvolutionChain from '$/components/Pokemon/EvolutionChain/';
	import Image from '$/components/UI/Image.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Pokedex from '$/components/Pokedex.svelte';
	import { currentUser } from '$lib/stores/user';
	import SelectedTags from '$/components/Tags/SelectedTags.svelte';
	import Breadcrumbs from '$/components/UI/Breadcrumbs.svelte';
	import SpritePreview from '$/components/Pokemon/SpritePreview.svelte';
	import Icon from '$/components/UI/Icon.svelte';
	import { page } from '$app/stores';
	import { pokemonDisplayStore } from '$lib/stores/pokemonPage';
	import CreateNewTag from '$/components/Tags/CreateNewTag.svelte';
	import { tagStore } from '$lib/stores/tags';
	import EditTag from '$/components/Tags/EditTag.svelte';
	import TypeMatchup from '$/components/Pokemon/TypeMatchup.svelte';
	import Abilities from '$/components/Pokemon/Abilities.svelte';
	import BaseStats from '$/components/Pokemon/BaseStats.svelte';
	import SocialPreview from '$/components/SocialPreview.svelte';
	import { Logger } from '$lib/log';
	import { isPokemonInGameGroup } from '$lib/data/games';
	import EncounterCard from '$/components/Pokemon/Encounters/EncounterCard.svelte';
	import MovesetCard from '$/components/Pokemon/Moveset/MovesetCard.svelte';

	export let data;

	$: {
		if (data) {
			const showFemaleSpriteIfExists = $page.url.searchParams.get('gender') === 'female';
			const showShinySpriteIfExists = $page.url.searchParams.get('shiny') === 'true';
			const varietyName = $page.url.searchParams.get('variety');

			const variety = {
				name: varietyName,
				spriteId: data.sprites.primary.url?.split('/')[8].split('.')[0]
			};

			pokemonDisplayStore.set({
				id: data.id,
				showFemaleSpriteIfExists,
				hasFemaleSprite: data.sprites.hasFemale,
				gender: data.sprites.hasFemale ? (showFemaleSpriteIfExists ? 'female' : 'male') : undefined,
				showShinySpriteIfExists,
				hasShinySprite: data.sprites.hasShiny,
				variety: variety.name ? variety : undefined,
				transferableQueryParams: '' // Gets auto-updated within the store anyway
			});
		}
	}

	const changeUrlQueryParam = (param: string, value: string) => {
		const newUrl = new URL($page.url);
		newUrl.searchParams.set(param, value);
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
			changeUrlQueryParam('shiny', $pokemonDisplayStore.showShinySpriteIfExists ? 'true' : 'false');
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

	const englishPokedexEntries = data.species.flavor_text_entries.filter(
		(entry) => entry.language === 'en'
	);

	async function getPrimarySprite(id: number) {
		return await fetch(`/api/pokemon/${id}/sprite`);
	}
</script>

<SocialPreview
	title={`${getMultiLanguageName(data.species.names, $primaryLanguage, $secondaryLanguage)}`}
	previewImage={`https://socialpreviews.pokecompanion.helbling.uk/pokemon/${data.id}-${filename(
		$page.url.searchParams.get('shiny'),
		$page.url.searchParams.get('gender')
	)}.png`}
	description={englishPokedexEntries.length > 0
		? englishPokedexEntries[englishPokedexEntries.length - 1].textEntry
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

<Navigator
	title={`${getMultiLanguageName(data.species.names, $primaryLanguage, $secondaryLanguage)}`}
	currentId={data.id}
	maxId={lastPokedexEntry}
	route="/pokemon"
	forms={data.pokemon.varietyForms}
/>

<div class="columns">
	<div class="column" style="padding-bottom: 1rem;">
		<div class="card">
			<div style="height: 20px; display: inline-flex; width: 100%; justify-content: space-between;">
				<div style="display: inline-flex; height: 20px; width: fit-content;">
					{#each data.pokemon.types as type}
						<Image src={type.icon} alt={type.name} style="margin-right: 4px; width: 50px;" />
					{/each}
				</div>
				<Pokedex pokedexEntries={data.species.flavor_text_entries} />
			</div>

			<SpritePreview
				primarySprite={data.sprites.primary}
				secondarySprite={data.sprites.secondary}
			/>

			{#if $currentUser}
				<div style="display: flex; justify-content: center; width: 100%; flex-flow: wrap;">
					<SelectedTags userId={$currentUser.id} pokemon={$pokemonDisplayStore} />
					{#if $tagStore.length > 0}
						<EditTag userId={$currentUser.id} pokemon={$pokemonDisplayStore} />
					{/if}
					<CreateNewTag
						userId={$currentUser.id}
						initialContent={{
							pokemon: [
								{
									id: data.id,
									gender: $pokemonDisplayStore.gender,
									shiny:
										$pokemonDisplayStore.hasShinySprite &&
										$pokemonDisplayStore.showShinySpriteIfExists,
									variety: $pokemonDisplayStore.variety
								}
							]
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
		</div>
	</div>
	<div class="column">
		<div class="card" id="evolutions">
			<EvolutionChain evolutionChainUrl={data.species.evolution_chain.url} />
		</div>
	</div>
</div>

<div class="columns">
	<div class="column">
		<div class="card">
			<TypeMatchup relations={data.pokemon.typeRelations} />
		</div>
	</div>

	<div class="column">
		<div class="card">
			<BaseStats data={data.pokemon.stats} />
		</div>
	</div>
</div>

<div class="columns">
	<div class="column">
		<div class="card">
			<div style="display: inline-flex; justify-content: space-between; width: 100%;">
				<h3 class="h3" style="margin-top: auto; margin-bottom: auto;">Encounters</h3>
			</div>
			<EncounterCard encounterData={data.encounters} />
		</div>
	</div>

	<div class="column">
		<div class="card">
			<a href={`${$page.url.pathname + $page.url.search + '#abilities'}`} class="no-style">
				<h3 class="h3" id="abilities">Abilities</h3>
			</a>
			<Abilities abilities={data.pokemon.abilities} />
		</div>
	</div>
</div>

<div class="columns">
	<div class="column">
		<div class="card">
			<div style="display: inline-flex; width: 100%; justify-content: space-between;">
				<h3 class="h3">Moveset</h3>
			</div>

			<MovesetCard movesetData={data.pokemon.moves} />
		</div>
	</div>
</div>

<style>
	.card {
		padding-top: 1rem;
		position: relative;
	}
</style>
