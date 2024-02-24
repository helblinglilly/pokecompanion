<script lang="ts">
	import { maxSearchResults, primaryLanguage, secondaryLanguage } from '$lib/stores/domain';
	import { getMultiLanguageName, type Languages } from '$lib/utils/language';

	interface IMove {
		names: Languages[];
		id: number;
	}
	export let moveResults: IMove[];
	let maxResults = maxSearchResults;
</script>

{#each moveResults.slice(0, maxResults) as move}
	<a href={`/move/${move.id}`} class="no-style" id={`ability-preview-${move.id}`}>
		<div
			class="card clickable"
			style="display: flex; align-items: center; padding: 1rem; margin-top: 1rem;"
		>
			<p>{getMultiLanguageName(move.names, $primaryLanguage, $secondaryLanguage)}</p>
		</div>
	</a>
{/each}
{#if maxResults < moveResults.length}
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
