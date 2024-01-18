<script lang="ts">
	import type { IEncounterGroups } from '$lib/data/encounterFilter';
	import { encounterDisplayStore } from '$lib/stores/pokemonPageStore';
	import EncounterVersion from '$components/Pokemon/EncounterVersion.svelte';

	export let encounterData: IEncounterGroups[];
	$: relevantEncounters = encounterData.filter((data) => {
		return (
			!$encounterDisplayStore.selectedGame ||
			$encounterDisplayStore.selectedGame.pokeapiName === data.versionGroup
		);
	});
</script>

<div>
	{#if relevantEncounters.length === 0}
		<p style="text-align: center; margin-top: 2rem;">This Pokémon cannot be found in the wild</p>
	{/if}

	{#each relevantEncounters as encounterVersion}
		<EncounterVersion data={encounterVersion} />
	{/each}
</div>
