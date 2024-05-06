<script lang="ts">
	import type { IEncounters } from '$lib/data/encounterFilter';
	import type { PokeapiVersionNames } from '$lib/data/games';
	import { selectedGame } from '$lib/stores/domain';
	import VersionSelect from '../../GameSelectors/VersionNameSelector';
	import EncounterVersion from './EncounterVersion.svelte';
	export let encounterData: IEncounters;
	let currentGame: PokeapiVersionNames | 'generic' = $selectedGame
		? $selectedGame.games[0].pokeapi
		: 'generic';
	let allGames = Object.keys(encounterData) as PokeapiVersionNames[];

	const defaultLimit = 4;

	$: relevantEncounter = currentGame === 'generic' ? {} : encounterData[currentGame] ?? {};

	$: totalLocations = currentGame === 'generic' ? 0 : Object.keys(relevantEncounter).length;
	let currentDisplayLimit = defaultLimit;
</script>

<VersionSelect
	versions={allGames}
	currentlySelected={$selectedGame ? $selectedGame.games[0].pokeapi : currentGame}
	onChange={(newVal) => {
		currentGame = newVal;
		currentDisplayLimit = defaultLimit;
	}}
	isVisibleOnEmptyOptions={false}
/>

{#if !currentGame || currentGame === 'generic'}
	<p>No game selected</p>
{:else}
	{#each Object.keys(relevantEncounter) as locationName, index}
		{#if index < currentDisplayLimit}
			<EncounterVersion
				encounterLocation={relevantEncounter[locationName]}
				locationKey={locationName}
			/>
		{/if}
	{/each}

	{#if currentDisplayLimit > defaultLimit}
		<div class="mt-3 inline-flex w-full space-between gap-3">
			<button
				class="button secondary w-full"
				on:click={() => {
					currentDisplayLimit = defaultLimit;
				}}>Collapse all</button
			>
			<button
				class="button secondary w-full"
				on:click={() => {
					currentDisplayLimit -= defaultLimit;
				}}>Show 4 less</button
			>
		</div>
	{/if}

	{#if currentDisplayLimit < totalLocations}
		<div class="mt-3 inline-flex w-full space-between gap-3">
			<button
				class="button secondary w-full"
				on:click={() => {
					currentDisplayLimit = totalLocations;
				}}>Show all</button
			>
			<button
				class="button secondary w-full"
				on:click={() => {
					currentDisplayLimit += defaultLimit;
				}}>Show more ({currentDisplayLimit}/{totalLocations})</button
			>
		</div>
	{/if}
{/if}
