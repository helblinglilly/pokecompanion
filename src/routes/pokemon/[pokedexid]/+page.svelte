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
	import EvolutionChain from '$components/Pokemon/EvolutionChain/';
	import Image from '$components/UI/Image.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Pokedex from '$components/Pokedex.svelte';
	import { currentUser } from '$lib/stores/user';
	import SelectedTags from '$components/Tags/SelectedTags.svelte';
	import Breadcrumbs from '$components/UI/Breadcrumbs.svelte';
	import { findBaseSprites, findPrimarySprite, findSecondarySprite } from '$lib/pokemon-id/sprites';
	import SpritePreview from '$components/Pokemon/SpritePreview.svelte';
	import Icon from '$components/UI/Icon.svelte';
	import { page } from '$app/stores';
	import {
		encounterDisplayStore,
		moveDisplayStore,
		pokemonDisplayStore
	} from '$lib/stores/pokemonPage';
	import CreateNewTag from '$components/Tags/CreateNewTag.svelte';
	import { tagStore } from '$lib/stores/tags';
	import EditTag from '$components/Tags/EditTag.svelte';
	import TypeMatchup from '$components/Pokemon/TypeMatchup.svelte';
	import Abilities from '$components/Pokemon/Abilities.svelte';
	import BaseStats from '$components/Pokemon/BaseStats.svelte';
	import Encounters from '$components/Pokemon/Encounters.svelte';
	import Moveset from '$components/Pokemon/Moveset.svelte';
	import { uniques } from '$lib/utils/array';
	import SocialPreview from '$components/SocialPreview.svelte';
	import { Logger } from '$lib/log';
	import { GameGroups, getGameGroupFromName, isPokemonInGameGroup } from '$lib/data/games';

	export let data;

	$: {
		if (data) {
			const baseSprite = findBaseSprites(
				data.pokemon.sprites,
				$versionSpecificSprites,
				$selectedGame?.pokeapi,
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

			const allRelevantGames = GameGroups.filter((game) => {
				return (
					data.encounters.some((encounter) => {
						return encounter.versionGroup === game.pokeapi;
					}) ||
					data.pokemon.moves.some((move) => {
						return move.versionGroup === game.pokeapi;
					})
				);
			}).flat();

			const encounterRelevantGames = data.encounters
				.filter((data) => {
					return data.encounters.length > 0;
				})
				.map((entry) => {
					return getGameGroupFromName(entry.versionGroup);
				});

			moveDisplayStore.set({
				games: data.moveGames.filter((a) => a !== 'xd' && a !== 'colosseum'),
				selectedGameGroup: $selectedGame ? $selectedGame.pokeapi : data.moveGames[0]
			});

			// encounterDisplayStore.set({
			// 	games: encounterRelevantGames,
			// 	selectedGame: $selectedGame
			// 		? encounterRelevantGames.find((encounterGame: IGame) => {
			// 				return $selectedGame?.pokeapi === encounterGame.pokeapiVersionGroup;
			// 		  }) ?? $selectedGame
			// 		: encounterRelevantGames[0],
			// 	selectedGameGroup: $selectedGame ? getGameGroupFromName(
			// 			allRelevantGames.length > 0
			// 			? allRelevantGames[0].shortName
			// 			: undefined
			// 	)
			// });
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

	$: gameVersionGroups = [];
	//  uniques(
	// 	$encounterDisplayStore.games
	// 		.filter((game) => {
	// 			if ($selectedGame) {
	// 				return game.pokeapi === $selectedGame.pokeapi;
	// 			}
	// 			return true;
	// 		})
	// 		.sort((a, b) => {
	// 			return a?.generation < b?.generation ? 1 : -1;
	// 		})
	// 		.map((game) => {
	// 			return game;
	// 		})
	// );

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
				primarySprite={$pokemonDisplayStore.primarySprite}
				secondarySprite={$pokemonDisplayStore.secondarySprite}
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

				<!-- {#if $encounterDisplayStore.games.length > 0}
					<select
						class="specificGameSelector"
						id="encounterGameSelector"
						on:change={(event) => {
							if (event.target) {
								// encounterDisplayStore.set({
								// 	games: $encounterDisplayStore.games,
								// 	selectedGame: games.find(
								// 		// @ts-ignore
								// 		(a) => a.pokeapiName === event.target.value
								// 	),
								// 	selectedGameGroup: $encounterDisplayStore.selectedGameGroup
								// });
							}
						}}
					>
						{#each $encounterDisplayStore.games as game}
							<option
								value={game.pokeapiName}
								selected={$encounterDisplayStore.selectedGame?.pokeapiName === game.pokeapiName}
								>{game.shortName}</option
							>
						{/each}
					</select>
				{/if} -->
			</div>
			<Encounters encounterData={data.encounters} />
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
			<div
				style="display: inline-flex; width: 100%; justify-content: space-between; margin-bottom: 1rem;"
			>
				<h3 class="h3">Moveset</h3>
				{#if $moveDisplayStore.games.length > 1}
					<select
						class="specificGameSelector"
						id="moveGameSelector"
						on:change={(event) => {
							if (event.target) {
								// moveDisplayStore.set({
								// 	games: $moveDisplayStore.games,
								// 	selectedGameGroup: getGameGroupFromName(event.target.value)?.pokeapi
								// });
							}
						}}
					>
						<!-- {#each $moveDisplayStore.games as gameGroup}
							{#if gameGroup}
								<option
									value={gameGroup}
									selected={$moveDisplayStore.selectedGameGroup === gameGroup ?? false}
									>{gameGroups
										.find((group) => group.some((a) => a.pokeapiVersionGroup === gameGroup))
										?.map((a) => a.shortName)
										.join(' / ')}</option
								>
							{/if}
						{/each} -->
					</select>
				{/if}
			</div>

			{#await data.moveData}
				<p>Loading moves...</p>
			{:then moveData}
				<Moveset completeData={moveData} />
			{:catch error}
				<p>error loading comments: {error}</p>
			{/await}
		</div>
	</div>
</div>

<style>
	.card {
		padding-top: 1rem;
		position: relative;
	}

	.specificGameSelector {
		margin-top: 0;
		margin-bottom: 0;
		margin-right: 0;
	}

	#encounterGameSelector {
		max-width: 50%;
	}

	@media screen and (min-width: 768px) {
		#moveGameSelector {
			max-width: 25%;
		}
	}

	@media screen and (max-width: 768px) {
		#moveGameSelector {
			max-width: 50%;
		}
	}
</style>
