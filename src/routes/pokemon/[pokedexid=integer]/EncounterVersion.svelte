<script lang="ts">
	import { Logger } from '$/debt/log';
	import ExpandableButton from '$/lib/components/ExpandableButton.svelte';
	import { capitaliseEachWord } from '$/lib/utils/string';

	interface Props {
		encounterLocation: Array<{
			method: string;
			minLevel: number;
			maxLevel: number;
			chance: number;
			conditions: Array<string>;
		}>;
		locationKey: string;
	}

	let { encounterLocation, locationKey }: Props = $props();

	let hasRequirement = $derived(encounterLocation.some((a) => a.conditions.length >= 1));
</script>

<ExpandableButton
	onclick={() => {
		Logger.addPageAction('EncounterExpand');
	}}
>
	{#snippet title()}
		<p class="button secondary ml-auto mr-auto">
			{capitaliseEachWord(locationKey.replaceAll('-', ' '))}
		</p>
	{/snippet}

	{#snippet content()}
		<div class="extendedWrapper">
			<table>
				<thead>
					<tr>
						<th>Method</th>
						<th>Level</th>
						<th>Chance</th>
						{#if hasRequirement}
							<th>Req</th>
						{/if}
					</tr>
				</thead>
				<tbody>
					{#each encounterLocation.sort( (a, b) => (a.minLevel > b.minLevel ? 1 : -1) ) as locationInfo}
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
	{/snippet}
</ExpandableButton>

<style>
	table {
		width: 100%;
	}
	td {
		text-align: center;
	}
</style>
