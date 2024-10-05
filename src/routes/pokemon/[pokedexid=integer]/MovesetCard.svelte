<script lang="ts">
	import {
		getGameGroupFromName,
		type IGameGroups,
		type PokeapiVersionGroups
	} from '$lib/data/games';
	import { selectedGame } from '$lib/stores/domain';
	import Moveset from './Moveset.svelte';
	import type { IMoves } from '$/lib/data/movesetFilter';
	import Select from '$/ui/atoms/select';

	export let movesetData: IMoves;

	$: allApplicableVersions = (
		Object.keys(movesetData)
			.map((key) => getGameGroupFromName(key as PokeapiVersionGroups))
			.filter((a) => a) as IGameGroups[]
	).sort((a, b) => {
		const aIndex = getGameGroupFromName(a.pokeapi)?.games[0].globalSortOrder ?? -1;
		const bIndex = getGameGroupFromName(b.pokeapi)?.games[0].globalSortOrder ?? -1;

		return aIndex > bIndex ? 1 : -1;
	});

	$: selectedVersionGroup =
		allApplicableVersions.length > 0
			? allApplicableVersions.find((version) => version.pokeapi === $selectedGame?.pokeapi)
					?.pokeapi ?? allApplicableVersions[0].pokeapi
			: undefined;
</script>

{#if selectedVersionGroup}
	<Select
		isNested
		options={allApplicableVersions.map((version) => ({
			label: version.shortName,
			value: version.pokeapi
		}))}
		value={selectedVersionGroup}
		on:change={({ detail }) => {
			selectedGame.set(getGameGroupFromName(detail));
		}}
	/>

	<Moveset completeData={movesetData[selectedVersionGroup]} />
{:else}
	<p>No data</p>
{/if}
