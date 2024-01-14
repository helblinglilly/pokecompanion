<script lang="ts">
	import type { IEncounterGroups } from '$lib/data/encounterFilter';
	import { encounterDisplayStore } from '$lib/stores/pokemonPageStore';
	import EncounterVersion from '$components/Pokemon/EncounterVersion.svelte';

	export let encounterData: IEncounterGroups[];
</script>

<div>
	{#if encounterData.length === 0}
		<p style="text-align: center;">This Pokémon cannot be found in the wild</p>
	{/if}

	{#each encounterData as encounterVersion}
		{#if !$encounterDisplayStore.selectedGame || $encounterDisplayStore.selectedGame.pokeapiName === encounterVersion.versionGroup}
			<EncounterVersion data={encounterVersion} />
		{/if}
	{/each}
</div>

<style>
	button.card {
		background-color: var(--secondary);
		margin-bottom: 1rem;
	}
	button.card:hover {
		background-color: var(--primary);
	}

	.extendedWrapper {
		justify-content: start;
	}
	button.viewMore {
		margin-top: 1rem;
	}

	@media screen and (max-width: 768px) {
		button.viewMore {
			width: 100%;
		}

		button.viewMore:not(:last-child) {
			margin-bottom: 1rem;
		}
	}
</style>
