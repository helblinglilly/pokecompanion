<script lang="ts">
	import { maxSearchResults, primaryLanguage, secondaryLanguage } from '$lib/stores/domain';
	import { getLanguageEntry, getMultiLanguageName, type Languages } from '$lib/utils/language';
	import Image from '$components/Image.svelte';

	interface IItem {
		names: Languages[];
		id: number;
		name: string;
	}
	export let itemResults: IItem[];
	let maxResults = maxSearchResults;
</script>

{#each itemResults as item, index}
	{#if index < maxResults}
		<a href={`/item/${item.id}`} class="no-style" id={`item-preview-${item.id}`}>
			<div
				class="card clickable"
				style="display: flex; align-items: center; padding: 1rem; margin-top: 1rem;"
			>
				<div class="spriteWrapper">
					<Image
						src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.name}.png`}
						alt={`${getLanguageEntry(item.names, $primaryLanguage)} sprite`}
						loading="lazy"
						height="48px"
						width="48px"
					/>
				</div>
				<p>
					{getMultiLanguageName(item.names, $primaryLanguage, $secondaryLanguage)}
				</p>
			</div>
		</a>
	{/if}
{/each}
{#if maxResults < itemResults.length}
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

<style>
	.spriteWrapper {
		max-width: 48px;
		margin-right: 1.5rem;
	}
</style>
