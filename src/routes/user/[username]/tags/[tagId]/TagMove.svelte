<script lang="ts">
	import { primaryLanguage, secondaryLanguage } from '$/lib/stores/domain';
	import type { TagRecord } from '$/lib/types/ITags';
	import { getMultiLanguageName } from '$/lib/utils/language';
	import { termNormaliser } from '$/lib/utils/string';
	import { page } from '$app/stores';
	import { getContext } from 'svelte';
	import { type Writable } from 'svelte/store';
	import { getSortFunction, patchTag } from './helper';
	import { getMoveEntry } from '$/lib/data/games';
	import MoveListEntry from '$/ui/molecules/move/list/MoveListEntry.svelte';
	import MoveCardEntry from '$/ui/molecules/move/card/MoveCardEntry.svelte';
	export let filterTerm: string;

	export let inModifyView: boolean;

	let tag = getContext('tag') as Writable<TagRecord>;

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
					$page.url.searchParams.get('sortBy') || $tag.sortKey,
					$page.url.searchParams.get('sortOrder') || $tag.sortOrder
				).sortFunction
			) ?? [];
</script>

{#if moveCollection.length > 0 && $page.url.searchParams.get('view') === 'card'}
	<h2 class="h2 pb-0">Moves</h2>
	<div
		class="grid gap-8 justify-center grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl-grid-cols-6"
	>
		{#each moveCollection as move}
			<MoveCardEntry
				id={move.id}
				showRemoveButton={inModifyView}
				onRemoveClick={() => {
					const optimisticTag = {
						...$tag,
						contents: {
							...$tag.contents,
							move: $tag.contents.move?.filter((tagMove) => tagMove.id !== move.id)
						}
					};
					const originalTag = { ...$tag };

					tag.set(optimisticTag);

					patchTag(optimisticTag).then((newTag) => {
						if (newTag) {
							tag.set(newTag);
						} else {
							tag.set(originalTag);
						}
					});
				}}
			/>
		{/each}
	</div>
{:else if moveCollection?.length > 0}
	<h2 class="h2 pb-0">Moves</h2>
	<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
		{#each moveCollection as move}
			<MoveListEntry
				id={move.id}
				showRemoveButton={inModifyView}
				onRemoveClick={() => {
					const optimisticTag = {
						...$tag,
						contents: {
							...$tag.contents,
							move: $tag.contents.move?.filter((tagMove) => tagMove.id !== move.id)
						}
					};
					const originalTag = { ...$tag };

					tag.set(optimisticTag);

					patchTag(optimisticTag).then((newTag) => {
						if (newTag) {
							tag.set(newTag);
						} else {
							tag.set(originalTag);
						}
					});
				}}
			/>
		{/each}
	</div>
{/if}
