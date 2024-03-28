<script lang="ts">
	import { navigating } from '$app/stores';
	import ExpandableButton from '$components/UI/ExpandableButton.svelte';
	import type { IEncounterGroups } from '$lib/data/encounterFilter';
	import { uniques } from '$lib/utils/array';
	import { capitaliseEachWord } from '$lib/utils/string';

	export let data: IEncounterGroups;
	let defaultVisibilityIndex = 2;
	let visibilityIndexStepCount = 5;
	let visibleIndex = defaultVisibilityIndex;

	navigating.subscribe(() => {
		visibleIndex = defaultVisibilityIndex;
	});
</script>

{#each data.encounters as encounter, i}
	{#if i < visibleIndex}
		<ExpandableButton
			buttonClasses="secondary"
			buttonStyles="width: 100%;"
			onClick={() => {
				window?.newrelic?.addPageAction('UIInteraction', {
					field: 'Encounter'
				});
			}}
		>
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
							{#if uniques(encounter.methods).some((a) => {
								return a.conditions;
							})}
								<th>Req</th>
							{/if}
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
									{#if method.conditions}
										<td style="text-align: center"
											>{capitaliseEachWord(method.conditions.replaceAll('-', ' '))}</td
										>
									{/if}
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

{#if visibleIndex < data.encounters.length || visibleIndex > defaultVisibilityIndex}
	<hr style="margin-top: 1rem;" />
{/if}

{#if visibleIndex < data.encounters.length}
	<button
		class="button secondary"
		style="margin-top: 1rem; width: 100%;"
		on:click={() => {
			visibleIndex += Math.min(visibilityIndexStepCount, data.encounters.length - visibleIndex);
		}}>Show more ({visibleIndex}/{data.encounters.length})</button
	>
{/if}

{#if visibleIndex > defaultVisibilityIndex}
	<button
		class="button secondary"
		style="margin-top: 1rem; width: 100%;"
		on:click={() => {
			visibleIndex -= Math.min(visibilityIndexStepCount, data.encounters.length - visibleIndex + 1);
		}}
		>Show {data.encounters.length < visibleIndex + visibilityIndexStepCount
			? data.encounters.length - visibleIndex + 1
			: visibilityIndexStepCount} less</button
	>
{/if}
