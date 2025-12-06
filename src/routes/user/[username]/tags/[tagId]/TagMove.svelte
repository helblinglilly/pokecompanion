<script lang="ts">
	import { primaryLanguage, secondaryLanguage } from '$/lib/stores/domain';
	import { getMultiLanguageName } from '$/lib/utils/language';
	import { termNormaliser } from '$/lib/utils/string';
	import { page } from '$app/stores';
	import { getContext } from 'svelte';
	import { type Writable } from 'svelte/store';
	import { getSortFunction } from './helper';
	import { getMoveEntry } from '$/lib/data/games';
	import OldMoveListEntry from '$/ui/molecules/move/list/OldMoveListEntry.svelte';
	import MoveCardEntry from '$/ui/molecules/move/card/MoveCardEntry.svelte';
	import type { APITag } from '$/@types/api.pokecompanion';
	import { PUBLIC_API_HOST } from '$env/static/public';
	import type { paths } from '$/@types/api';
	import { addNotification } from '$/lib/stores/notifications';
	export let filterTerm: string;

	export let inModifyView: boolean;

	let tag = getContext('tag') as Writable<APITag['tags'][number]>;

	async function deleteMoveFromTag(move: { id: number }) {
		const res = await fetch(PUBLIC_API_HOST + `/tags/${$tag.id}/move`, {
			method: 'DELETE',
			body: JSON.stringify({
				moveId: move.id
			}),
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		});

		if (res.status === 200) {
			const body: paths['/tags/{tagId}/move']['delete']['responses']['200']['content']['application/json'] =
				await res.json();
			tag.set(body);
		} else {
			addNotification({
				message: 'Failed to remove move from tag',
				level: 'failure'
			});
		}
	}
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
						on:click={async () => {
							await deleteMoveFromTag(move);
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
				<OldMoveListEntry id={move.id} isClickable={!inModifyView}>
					<button
						slot="remove"
						class={`removeButton ${inModifyView ? '' : 'hidden'}`}
						on:click={async (e) => {
							await deleteMoveFromTag(move);
						}}>-</button
					>
				</OldMoveListEntry>
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
