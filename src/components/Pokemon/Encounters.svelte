<script lang="ts">
	import type { IEncounterGroups } from '$lib/data/encounterFilter';
	import { encounterDisplayStore, pokemonDisplayStore } from '$lib/stores/pokemonPage';
	import EncounterVersion from '$components/Pokemon/EncounterVersion.svelte';
	import { selectedGame } from '$lib/stores/domain';

	export let encounterData: IEncounterGroups[];
	$: relevantEncounters = encounterData.filter((data) => {
		return (
			!$encounterDisplayStore.selectedGame ||
			$encounterDisplayStore.selectedGame.pokeapi === data.versionGroup
		);
	});
</script>

<div>
	{#if relevantEncounters.length === 0}
		{#if ($selectedGame && $selectedGame.generation.number >= 8) || $pokemonDisplayStore.id >= 810}
			<p>Data is known to be incomplete starting with Sword/Shield.</p>
		{/if}
		<p style="text-align: center; margin-top: 2rem;">This Pokémon cannot be found in the wild</p>
	{/if}

	{#each relevantEncounters as encounterVersion}
		<EncounterVersion data={encounterVersion} />
	{/each}
</div>

<style>
	p {
		text-align: center;
	}
</style>
