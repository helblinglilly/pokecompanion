<script lang="ts">
	import Button from '$/ui/atoms/button/Button.svelte';
	import Select from '$/ui/atoms/select';
	import type { IEncounters } from '$lib/data/encounterFilter';
	import { getGameFromName, type PokeapiVersionNames } from '$lib/data/games';
	import { selectedGame } from '$lib/stores/domain';
	import EncounterVersion from './EncounterVersion.svelte';

	export let encounterData: IEncounters;

	let allGames = (Object.keys(encounterData) as PokeapiVersionNames[]).sort((a, b) => {
		return getGameFromName(a).globalSortOrder > getGameFromName(b).globalSortOrder ? 1 : -1;
	});

	let currentGame: PokeapiVersionNames = $selectedGame
		? $selectedGame.games[0].pokeapi
		: allGames[0];

	const defaultLimit = 4;

	$: relevantEncounter = encounterData[currentGame] ?? {};

	$: totalLocations = Object.keys(relevantEncounter).length;

	let currentDisplayLimit = defaultLimit;
</script>

{#if $selectedGame && !$selectedGame.games.some((a) => a.pokeapi === currentGame)}
	<p>Missing data for {$selectedGame.shortName}</p>
{/if}

{#if allGames.length > 0}
	<Select
		style="width: 100%; margin-right: 0; max-width: inherit;"
		isNested
		options={allGames.map((game) => ({
			label: getGameFromName(game).shortName,
			value: game
		}))}
		value={allGames.findIndex((game) => game === currentGame) > 0 ? currentGame : allGames[0]}
		on:change={({ detail }) => {
			currentGame = detail;
			currentDisplayLimit = defaultLimit;
		}}
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
					style="height: 3rem;"
					classes="w-full"
					on:click={() => {
						currentDisplayLimit = defaultLimit;
					}}>Collapse all</Button
				>
				<Button
					variant="primary"
					style="height: 3rem;"
					classes="w-full"
					on:click={() => {
						currentDisplayLimit -= defaultLimit;
					}}>Show 4 less</Button
				>
			</div>
		{/if}

		{#if currentDisplayLimit < totalLocations}
			<div class="inline-flex w-full space-between gap-4">
				<Button
					variant="primary"
					style="height: 3rem;"
					classes="w-full"
					on:click={() => {
						currentDisplayLimit = totalLocations;
					}}>Show all</Button
				>
				<Button
					variant="primary"
					style="height: 3rem;"
					classes="w-full"
					on:click={() => {
						currentDisplayLimit += defaultLimit;
					}}>Show more ({currentDisplayLimit}/{totalLocations})</Button
				>
			</div>
		{/if}
	</div>
{/if}
