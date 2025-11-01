<script lang="ts">
	import { primaryLanguage, secondaryLanguage } from '$/lib/stores/domain';
	import { getMultiLanguageName } from '$/lib/utils/language';
	import { termNormaliser } from '$/lib/utils/string';
	import { page } from '$app/stores';
	import { getContext } from 'svelte';
	import { type Writable } from 'svelte/store';
	import { getSortFunction } from './helper';
	import { getMoveEntry } from '$/lib/data/games';
	import MoveListEntry from '$/ui/molecules/move/list/MoveListEntry.svelte';
	import MoveCardEntry from '$/ui/molecules/move/card/MoveCardEntry.svelte';
	import { isEqual } from 'lodash-es';
	import type { APITag } from '$/@types/api.pokecompanion';
	export let filterTerm: string;

	export let inModifyView: boolean;

	let tag = getContext('tag') as Writable<APITag['tags'][number]>;

	$: moveCollection =
		$tag.contents.move
			?.filter((move) => {
				if (!filterTerm) {
					return true;
				}
				const normalised = termNormaliser(filterTerm);
				const matchesId = `${move.id}`.includes(normalised);
				const names = termNormaliser(
					getMultiLanguageName(getMoveEntry(move.id).names, $primaryLanguage, $secondaryLanguage) ??
						''
				);

				const matchesName = names.includes(normalised);
				return matchesId || matchesName;
			})
			.sort(
				getSortFunction(
					($page.url.searchParams.get('sortBy') || $tag.sortKey) as
						| 'custom'
						| 'id'
						| 'added'
						| 'alphabetical',
					($page.url.searchParams.get('sortOrder') || $tag.sortOrder) as 'asc' | 'desc' | 'custom'
				).sortFunction
			) ?? [];
</script>

{#if moveCollection.length > 0 && $page.url.searchParams.get('view') === 'card'}
	<h2 class="h2 pb-0">Moves</h2>
	<div
		class="grid gap-8 justify-center grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl-grid-cols-6"
	>
		{#each moveCollection as move}
			<a href={inModifyView ? undefined : `/move/${move.id}`} class="no-underline">
				<MoveCardEntry id={move.id} isClickable={!inModifyView}>
					<button
						slot="remove"
						class={`removeButton ${inModifyView ? '' : 'hidden'}`}
						on:click={() => {
							const optimisticTag = {
								...$tag,
								contents: {
									...$tag.contents,
									move: $tag.contents.move?.filter((tagMove) => !isEqual(tagMove, move))
								}
							};
							const originalTag = { ...$tag };

							tag.set(optimisticTag);

							fetch(`/api/tag/${$tag.id}/move`, {
								method: 'DELETE',
								body: JSON.stringify({
									id: move.id
								})
							}).then((res) => {
								if (res.ok) {
									tag.set(optimisticTag);
								} else {
									tag.set(originalTag);
								}
							});
						}}
					>
						-
					</button>
				</MoveCardEntry>
			</a>
		{/each}
	</div>
{:else if moveCollection?.length > 0}
	<h2 class="h2 pb-0">Moves</h2>
	<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
		{#each moveCollection as move}
			<a href={inModifyView ? undefined : `/move/${move.id}`} class="no-underline">
				<MoveListEntry id={move.id} isClickable={!inModifyView}>
					<button
						slot="remove"
						class={`removeButton ${inModifyView ? '' : 'hidden'}`}
						on:click={(e) => {
							const optimisticTag = {
								...$tag,
								contents: {
									...$tag.contents,
									move: $tag.contents.move?.filter((tagMove) => !isEqual(tagMove, move))
								}
							};
							const originalTag = { ...$tag };

							tag.set(optimisticTag);

							fetch(`/api/tag/${$tag.id}/move`, {
								method: 'DELETE',
								body: JSON.stringify({
									id: move.id
								})
							}).then((res) => {
								if (res.ok) {
									tag.set(optimisticTag);
								} else {
									tag.set(originalTag);
								}
							});
						}}>-</button
					>
				</MoveListEntry>
			</a>
		{/each}
	</div>
{/if}

<style>
	.removeButton {
		position: absolute;
		top: 0;
		right: 0;
		text-align: center;
		height: 2rem;
		width: 2rem;
		border-radius: 10%;
		font-weight: bold;
		color: var(--light);
		background-color: var(--error);
		z-index: 1;
	}
</style>
