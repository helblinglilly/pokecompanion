<script lang="ts">
	import { maxSearchResults, primaryLanguage, secondaryLanguage } from '$lib/stores/domain';
	import { getMultiLanguageName, type Languages } from '$lib/utils/language';

	interface IAbility {
		names: Languages[];
		id: number;
	}
	export let abilityResults: IAbility[];
	let maxResults = maxSearchResults;
</script>

{#each abilityResults as ability, index}
	{#if index < maxResults}
		<a href={`/ability/${ability.id}`} class="no-style" id={`ability-preview-${ability.id}`}>
			<div
				class="card clickable"
				style="display: flex; align-items: center; padding: 1rem; margin-top: 1rem;"
			>
				<p>
					{getMultiLanguageName(ability.names, $primaryLanguage, $secondaryLanguage)}
				</p>
			</div>
		</a>
	{/if}
{/each}
{#if maxResults < abilityResults.length}
	<div style="display: flex; flex-direction: column">
		<button
			class="button"
			style="margin-top: 1rem;"
			on:click={() => {
				maxResults += maxSearchResults;
			}}>Show more items...</button
		>
	</div>
{/if}
