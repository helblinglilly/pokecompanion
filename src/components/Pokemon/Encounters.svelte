<script lang="ts">
	import ExpandableButton from '$components/UI/ExpandableButton.svelte';
	import type { IEncounterGroups } from '$lib/data/encounterFilter';
	import { uniques } from '$lib/utils/array';
	import { capitaliseEachWord } from '$lib/utils/string';
	import { encounterDisplayStore } from '$lib/stores/pokemonPageStore';

	export let encounterData: IEncounterGroups[];

	let visibleIndex = 2;
</script>

<div>
	{#if encounterData.length === 0}
		<p style="text-align: center;">This Pokémon cannot be found in the wild</p>
	{/if}

	{#each encounterData as encounterVersion}
		{#each encounterVersion.encounters as encounter, i}
			{#if i <= visibleIndex && (!$encounterDisplayStore.selectedGame || $encounterDisplayStore.selectedGame.pokeapiName === encounterVersion.versionGroup)}
				<ExpandableButton buttonClasses="secondary" buttonStyles="width: 100%;">
					<p slot="title" style="margin-left: auto; margin-right: auto;">
						{capitaliseEachWord(encounter.location.name.replaceAll('-', ' '))}
					</p>

					<div slot="content" class="extendedWrapper">
						{#if encounter.methods}
							<table style="width: 100%;">
								<thead>
									<th>Method</th>
									<th>Level</th>
									<th>Chance</th>
								</thead>
								<tbody>
									{#each uniques(encounter.methods) as method}
										<tr>
											<td style="text-align: center;"
												>{capitaliseEachWord(method.encounter_method.replaceAll('-', ' '))}</td
											>
											<td style="text-align: center;">
												Lv. {method.min_level === method.max_level
													? method.min_level
													: `${method.min_level} - ${method.max_level}`}
											</td>
											<td style="text-align: center;">{method.chance}%</td>
										</tr>
									{/each}
								</tbody>
							</table>
						{:else}
							<p>Missing info</p>
						{/if}
					</div>
				</ExpandableButton>
			{/if}
		{/each}
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
