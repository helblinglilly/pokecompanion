<script lang="ts">
	import { meta, selectedGame } from '$lib/stores/domain';
	import Moveset from './Moveset.svelte';
	import Select from '$/ui/atoms/Select.svelte';
	import type { APIPokemon, PokeapiVersionGroups } from '$/@types/api.pokecompanion';
	import type { paths } from '$/@types/api';

	interface Props {
		skeletonData: APIPokemon['moves'];
		movePromise: Promise<
			paths['/pokemon/{id}/moves']['get']['responses']['200']['content']['application/json']
		>;
		onlyShowCurrentGames?: boolean;
	}

	let { skeletonData, movePromise, onlyShowCurrentGames }: Props = $props();

	let allApplicableVersions = $derived(
		Object.keys(skeletonData).sort((a, b) => {
			const aIndex = $meta.games.findIndex((metaGame) => metaGame.pokeapi === a);
			const bIndex = $meta.games.findIndex((metaGame) => metaGame.pokeapi === b);

			return aIndex > bIndex ? 1 : -1;
		}) as PokeapiVersionGroups[]
	);

	let selectedVersionGroup = $derived(
		allApplicableVersions.length > 0
			? (allApplicableVersions.find((pokeapi) => pokeapi === $selectedGame?.pokeapi) ??
					allApplicableVersions[allApplicableVersions.length - 1])
			: undefined
	);
</script>

{#if selectedVersionGroup && !onlyShowCurrentGames}
	<Select
		isNested
		options={allApplicableVersions.map((version) => ({
			label: $meta.games.find((metaGame) => metaGame.pokeapi === version)?.shortName ?? '',
			value: version
		}))}
		value={selectedVersionGroup}
		onchange={(detail) => {
			const game = $meta.games.find((metaGame) => metaGame.pokeapi === detail);
			if (game) {
				selectedGame.set(game);
			}
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
