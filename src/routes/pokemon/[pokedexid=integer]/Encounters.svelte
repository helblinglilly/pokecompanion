<script lang="ts">
	import type { APIPokemon, MetaGame, PokeapiVersionGroups } from '$/@types/api.pokecompanion';
	import Button from '$/ui/atoms/Button.svelte';
	import Select from '$/ui/atoms/Select.svelte';
	import { meta, selectedGame } from '$lib/stores/domain';
	import EncounterVersion from './EncounterVersion.svelte';

	interface Props {
		encounterData: APIPokemon['encounters'];
		onlyShowCurrentGames?: boolean;
	}

	let { encounterData, onlyShowCurrentGames }: Props = $props();

	let allGames = $derived(
		Object.keys(encounterData)
			.sort((a, b) => {
				const aGameIndex =
					$meta.games
						.map((metaGames) => {
							const matching = metaGames.games.find((metaGame) => metaGame.pokeapi === a);
							return matching?.globalSortOrder ?? -1;
						})
						.filter((a) => a > 0)[0] ?? -1;
				const bGameIndex =
					$meta.games
						.map((metaGames) => {
							const matching = metaGames.games.find((metaGame) => metaGame.pokeapi === b);
							return matching?.globalSortOrder ?? -1;
						})
						.filter((a) => a > 0)[0] ?? -1;

				return aGameIndex > bGameIndex ? 1 : -1;
			})
			.filter((game) => {
				if (onlyShowCurrentGames) {
					const selectedGames = $selectedGame?.games
						.map((sGame) => sGame.pokeapi)
						?.concat($selectedGame?.dlcGames.map((sDlcGame) => sDlcGame.pokeapi));

					return selectedGames?.some((sGame) => sGame === game);
				}
				return true;
			}) as Array<MetaGame['games'][number]['pokeapi']>
	);

	let currentGame = $derived(
		allGames.filter((encounterGame) =>
			$selectedGame?.games.some((game) => game.pokeapi === encounterGame)
		).length > 0
			? $selectedGame?.games[0]?.pokeapi
			: allGames[allGames.length - 1]
	);

	const defaultLimit = 4;

	// @ts-expect-error Can't explicitly type currentGame
	let relevantEncounter = $derived(encounterData[currentGame] ?? {});

	let totalLocations = $derived(Object.keys(relevantEncounter).length);

	let currentDisplayLimit = $state(defaultLimit);
</script>

{#if !onlyShowCurrentGames && $selectedGame && !$selectedGame.games.some( (a) => allGames.includes(a.pokeapi) )}
	<p>Missing data for {$selectedGame.shortName}</p>
{/if}

{#if allGames.length > 0}
	<Select
		classes="encounter-game-selector"
		isNested
		options={allGames.map((game) => ({
			label:
				$meta.games
					.filter((gameGroup) => {
						return gameGroup.games.some((metaGame) => metaGame.pokeapi === game);
					})[0]
					?.games.find((metaGame) => metaGame.pokeapi === game)?.shortName ?? '',
			value: game
		}))}
		value={allGames.findIndex((game) => game === currentGame) > 0
			? currentGame
			: allGames[allGames.length - 1]}
		onchange={(detail) => {
			currentGame = detail as MetaGame['games'][number]['pokeapi'];
			currentDisplayLimit = defaultLimit;
		}}
		data-umami-event="PokemonEncounters"
	/>
{/if}

{#if !currentGame || allGames.length === 0}
	<p>No data available</p>
{:else}
	<div class="grid gap-4">
		{#each Object.keys(relevantEncounter) as locationName, index}
			{#if index < currentDisplayLimit}
				<EncounterVersion
					encounterLocation={relevantEncounter[locationName]}
					locationKey={locationName}
				/>
			{/if}
		{/each}

		{#if currentDisplayLimit > defaultLimit}
			<div class="inline-flex w-full space-between gap-4">
				<Button
					variant="primary"
					classes="encounter-page-button w-full"
					onclick={() => {
						currentDisplayLimit = defaultLimit;
					}}
					data-umami-event="PokemonEncountersCollapse">Collapse all</Button
				>
				<Button
					variant="primary"
					classes="encounter-page-button w-full"
					onclick={() => {
						currentDisplayLimit -= defaultLimit;
					}}
					data-umami-event="PokemonEncountersShowLess">Show 4 less</Button
				>
			</div>
		{/if}

		{#if currentDisplayLimit < totalLocations}
			<div class="inline-flex w-full space-between gap-4">
				<Button
					variant="primary"
					classes="encounter-page-button w-full"
					onclick={() => {
						currentDisplayLimit = totalLocations;
					}}
					data-umami-event="PokemonEncountersShowAll">Show all</Button
				>
				<Button
					variant="primary"
					classes="encounter-page-button w-full"
					onclick={() => {
						currentDisplayLimit += defaultLimit;
					}}
					data-umami-event="PokemonEncountersShowMore"
					>Show more ({currentDisplayLimit}/{totalLocations})</Button
				>
			</div>
		{/if}
	</div>
{/if}

<style>
	:global(.encounter-game-selector) {
		width: 100%;
		max-width: inherit;
		margin-right: 0;
	}

	:global(.encounter-page-button) {
		height: 3rem;
	}
</style>
