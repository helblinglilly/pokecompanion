<script lang="ts">
	import {
		lastPokedexEntry,
		primaryLanguage,
		secondaryLanguage,
		selectedGame,
		animateSprites,
		versionSpecificSprites
	} from '$lib/stores/domain';
	import { getMultiLanguageName } from '$lib/utils/language';
	import Navigator from '$components/Navigator.svelte';
	import EvolutionChain from '$components/Pokemon/EvolutionChain.svelte';
	import Image from '$components/UI/Image.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { isPokemonInGame } from '$lib/data/games';
	import Pokedex from '$components/Pokedex.svelte';
	import { currentUser } from '$lib/stores/user';
	import SelectedTags from '$components/Tags/SelectedTags.svelte';
	import Breadcrumbs from '$components/UI/Breadcrumbs.svelte';
	import { findBaseSprites, findPrimarySprite, findSecondarySprite } from '$lib/pokemon-id/sprites';
	import SpritePreview from '$components/Pokemon/SpritePreview.svelte';
	import Icon from '$components/UI/Icon.svelte';
	import { page } from '$app/stores';
	import { pokemonDisplayStore } from '$lib/stores/pokemonPageStore.js';
	import CreateNewTag from '$components/Tags/CreateNewTag.svelte';
	import { tagStore } from '$lib/stores/tagsStore';
	import EditTag from '$components/Tags/EditTag.svelte';
	import TypeMatchup from '$components/Pokemon/TypeMatchup.svelte';
	import Abilities from '$components/Pokemon/Abilities.svelte';
	import BaseStats from '$components/Pokemon/BaseStats.svelte';
	import Statistics from '$components/Pokemon/Statistics.svelte';
	import Encounters from '$components/Pokemon/Encounters.svelte';

	export let data;

	$: {
		if (data) {
			const baseSprite = findBaseSprites(
				data.pokemon.sprites,
				$versionSpecificSprites,
				$selectedGame?.cookieGroup,
				$animateSprites
			);

			const showFemaleSpriteIfExists = $page.url.searchParams.get('gender') === 'female';
			const showShinySpriteIfExists = $page.url.searchParams.get('shiny') === 'true';

			let primarySprite = findPrimarySprite(
				baseSprite,
				showFemaleSpriteIfExists,
				showShinySpriteIfExists
			);

			const varietyName = $page.url.searchParams.get('variety');

			const variety = {
				name: varietyName,
				spriteId: primarySprite.url?.split('/')[8].split('.')[0]
			};

			if (primarySprite.url === null && variety.name === null) {
				primarySprite = {
					url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`,
					alt: 'Default sprite'
				};
			}

			pokemonDisplayStore.set({
				id: data.id,
				showFemaleSpriteIfExists,
				hasFemaleSprite: baseSprite.meta.hasFemaleSprite,
				gender: baseSprite.meta.hasFemaleSprite
					? showFemaleSpriteIfExists
						? 'female'
						: 'male'
					: undefined,
				showShinySpriteIfExists,
				hasShinySprite: baseSprite.meta.hasShinySprite,
				primarySprite,
				secondarySprite: findSecondarySprite(
					baseSprite,
					showFemaleSpriteIfExists,
					showShinySpriteIfExists
				),
				variety: variety.name ? variety : undefined
			});
		}
	}

	const changeUrlQueryParam = (param: string, value: string) => {
		const newUrl = new URL($page.url);
		newUrl.searchParams.set(param, value);
		goto(newUrl.toString(), { replaceState: true });
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
</script>

<svelte:head>
	<title
		>#{data.id}
		{`${getMultiLanguageName(data.species.names, $primaryLanguage, $secondaryLanguage)}`}</title
	>
</svelte:head>

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
				<div style="display: inline-flex; height: 20px; width: 150px;">
					{#each data.pokemon.types as type}
						<Image src={type.icon} alt={type.name} style="margin-right: 4px; width: 50px;" />
					{/each}
				</div>
				<Pokedex flavourTextEntries={data.species.flavor_text_entries} />
			</div>

			<SpritePreview
				primarySprite={$pokemonDisplayStore.primarySprite}
				secondarySprite={$pokemonDisplayStore.secondarySprite}
			/>

			{#if $currentUser}
				<div style="display: flex; justify-content: center; width: 100%; flex-flow: wrap;">
					<SelectedTags userId={$currentUser.id} />
					{#if $tagStore.length > 0}
						<EditTag userId={$currentUser.id} />
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
			{#if !isPokemonInGame(data.id, $selectedGame)}
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
			<h3>Encounter places</h3>
			<Encounters id={data.id} />
		</div>
	</div>

	<div class="column">
		<div class="card">
			<a href={`${$page.url.pathname + $page.url.search + '#abilities'}`} class="no-style">
				<h3 id="abilities">Abilities</h3>
			</a>
			<Abilities abilities={data.pokemon.abilities} />
		</div>
	</div>
</div>

<div class="columns">
	<div class="column">
		<div class="card">
			<h3>Moveset</h3>
		</div>
	</div>
</div>

<style>
	.card {
		padding-top: 1rem;
		position: relative;
	}
</style>
