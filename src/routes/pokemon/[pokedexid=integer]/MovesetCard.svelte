<script lang="ts">
	import { selectedGame } from '$lib/stores/domain';
	import Moveset from './Moveset.svelte';
	import Select from '$/ui/atoms/select';
	import type { APIPokemon, PokeapiVersionGroups } from '$/@types/api.pokecompanion';
	import type { paths } from '$/@types/api';
	import { getGameGroupFromName, type IGameGroups } from '$/debt/games';

	export let skeletonData: APIPokemon['moves'];
	export let movePromise: Promise<
		paths['/pokemon/{id}/moves']['get']['responses']['200']['content']['application/json']
	>;

	$: allApplicableVersions = (
		Object.keys(skeletonData)
			.map((key) => getGameGroupFromName(key as PokeapiVersionGroups))
			.filter((a) => a) as IGameGroups[]
	).sort((a, b) => {
		const aIndex = getGameGroupFromName(a.pokeapi)?.games[0]?.globalSortOrder ?? -1;
		const bIndex = getGameGroupFromName(b.pokeapi)?.games[0]?.globalSortOrder ?? -1;

		return aIndex > bIndex ? 1 : -1;
	});

	$: selectedVersionGroup =
		allApplicableVersions.length > 0
			? allApplicableVersions.find((version) => version.pokeapi === $selectedGame?.pokeapi)
					?.pokeapi ?? allApplicableVersions[allApplicableVersions.length - 1]?.pokeapi
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

	{#await movePromise}
		<p>Loading...</p>
	{:then moveData}
		<Moveset completeData={moveData[selectedVersionGroup]} />
	{/await}
{:else}
	<p>No data</p>
{/if}
