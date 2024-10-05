<script lang="ts">
	import ExpandableButton from '$/lib/components/ExpandableButton.svelte';
	import type { IEncounterLocation } from '$/lib/data/encounterFilter';
	import { Logger } from '$/lib/log';
	import { capitaliseEachWord } from '$/lib/utils/string';

	export let encounterLocation: IEncounterLocation[];
	export let locationKey: string;

	$: hasRequirement = encounterLocation.some((a) => a.conditions.length >= 1);
</script>

<ExpandableButton
	on:click={() => {
		Logger.addPageAction('UIInteraction', 'Encounter');
	}}
>
	<p slot="title" class="button secondary ml-auto mr-auto">
		{capitaliseEachWord(locationKey.replaceAll('-', ' '))}
	</p>

	<div slot="content" class="extendedWrapper">
		<table>
			<thead>
				<th>Method</th>
				<th>Level</th>
				<th>Chance</th>
				{#if hasRequirement}
					<th>Req</th>
				{/if}
			</thead>
			<tbody>
				{#each encounterLocation.sort((a, b) => (a.minLevel > b.minLevel ? 1 : -1)) as locationInfo}
					<tr>
						<td>
							{capitaliseEachWord(locationInfo.method.replaceAll('-', ' '))}
						</td>
						<td>
							{#if locationInfo.minLevel !== locationInfo.maxLevel}
								{locationInfo.minLevel} - {locationInfo.maxLevel}
							{:else}
								{locationInfo.maxLevel}
							{/if}
						</td>
						<td>
							{locationInfo.chance}%
						</td>
						{#if hasRequirement}
							<td>
								{locationInfo.conditions
									.map((a) => capitaliseEachWord(a.replaceAll('-', ' ')))
									.join(', ')}
							</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</ExpandableButton>

<style>
	table {
		width: 100%;
	}
	td {
		text-align: center;
	}
</style>
