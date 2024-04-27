<script lang="ts">
	import {
		getGameGroupFromName,
		type IGameGroups,
		type PokeapiVersionGroups
	} from '$lib/data/games';
	import { selectedGame } from '$lib/stores/domain';
	import VersionGroupSelector from '$components/GameSelectors/VersionGroupSelector/VersionGroupSelector.svelte';
	import type { IPokemonMoveAPIResponse } from '../../../routes/api/pokemon/[pokedex]/moves/+server';
	import Moveset from './Moveset.svelte';

	export let movesetData: IPokemonMoveAPIResponse;

	$: allApplicableVersions = Object.keys(movesetData)
		.map((key) => getGameGroupFromName(key as PokeapiVersionGroups))
		.filter((a) => a) as IGameGroups[];

	$: selectedVersionGroup = ($selectedGame?.pokeapi ?? 'generic') as
		| PokeapiVersionGroups
		| 'generic';

	$: applicableMoveset =
		selectedVersionGroup && selectedVersionGroup !== 'generic'
			? movesetData[selectedVersionGroup]
			: undefined;
</script>

<VersionGroupSelector
	versionGroups={allApplicableVersions}
	currentlySelected={selectedVersionGroup}
	onChange={(newVal) => (selectedVersionGroup = newVal)}
	isVisibleOnEmptyOptions={false}
	showGenericOption
/>

{#if selectedVersionGroup === 'generic'}
	<p>No game selected</p>
{:else}
	<Moveset completeData={applicableMoveset} />
{/if}
