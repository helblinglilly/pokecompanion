<script lang="ts">
	import ExpandableButton from '$/components/UI/ExpandableButton.svelte';
	import type { IEncounterLocation } from '$/lib/data/encounterFilter';
	import { Logger } from '$/lib/log';
	import { capitaliseEachWord } from '$/lib/utils/string';

	export let encounterLocation: IEncounterLocation[];
	export let locationKey: string;

	$: hasRequirement = encounterLocation.some((a) => a.conditions.length >= 1);
</script>

<ExpandableButton
	buttonClasses="secondary"
	buttonStyles="width: 100%; display: contents;"
	onClick={() => {
		Logger.addPageAction('UIInteraction', 'Encounter');
	}}
>
	<p slot="title" class="button secondary ml-auto mr-auto mt-3">
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
								{#each locationInfo.conditions as condition}
									{capitaliseEachWord(condition.replaceAll('-', ' '))}
								{/each}
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
