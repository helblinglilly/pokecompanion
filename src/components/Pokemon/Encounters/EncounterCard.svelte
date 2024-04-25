<script lang="ts">
	import type { IEncounterGroups } from '$lib/data/encounterFilter';
	import type { PokeapiVersionNames } from '$lib/data/games';
	import { selectedGame } from '$lib/stores/domain';
	import EncounterVersion from '../EncounterVersion.svelte';
	import VersionSelect from '../../GameSelectors/VersionNameSelector';

	export let encounterData: IEncounterGroups[];

	$: selectedVersion = ($selectedGame?.games[0].pokeapi ?? 'generic') as
		| PokeapiVersionNames
		| 'generic'
		| undefined;

	$: currentEncounterData = encounterData.filter((data) => {
		if (selectedVersion && selectedVersion !== 'generic') {
			return data.versionGroup === selectedVersion;
		}
	});
</script>

<VersionSelect
	versions={encounterData.map((encounter) => encounter.versionGroup)}
	currentlySelected={selectedVersion}
	onChange={(newVal) => (selectedVersion = newVal)}
/>

{#if !currentEncounterData || currentEncounterData.length === 0}
	{#if $selectedGame === undefined}
		<p>No game selected</p>
	{:else}
		<p>No encouters are known for {$selectedGame?.shortName}</p>
	{/if}
{:else}
	{#each currentEncounterData as encounter}
		<EncounterVersion data={encounter} />
	{/each}
{/if}
