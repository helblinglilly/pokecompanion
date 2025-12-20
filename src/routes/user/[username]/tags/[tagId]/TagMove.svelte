<script lang="ts">
	import { page } from '$app/state';
	import MoveCardEntry from '$/ui/molecules/move/card/MoveCardEntry.svelte';
	import type { APITag } from '$/@types/api.pokecompanion';
	import { PUBLIC_API_HOST } from '$env/static/public';
	import type { paths } from '$/@types/api';
	import { addNotification } from '$/lib/stores/notifications';
	import MoveListEntry from '$/ui/molecules/move/list';
	import { invalidate } from '$app/navigation';

	async function deleteMoveFromTag(move: { id: number }) {
		const res = await fetch(PUBLIC_API_HOST + `/tags/${tag.id}/move`, {
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
			invalidate(`tag:${tag.id}`);
		} else {
			addNotification({
				message: 'Failed to remove move from tag',
				level: 'failure'
			});
		}
	}

	interface Props {
		inModifyView: boolean;
		moveCollection: paths['/tags/{tagId}/move']['get']['responses']['200']['content']['application/json']['moves'];
		tag: APITag['tags'][number];
	}

	let { inModifyView, moveCollection, tag }: Props = $props();
</script>

{#if moveCollection.length > 0 && page.url.searchParams.get('view') === 'card'}
	<h2 class="h2 pb-0">Moves</h2>
	<div
		class="grid gap-8 justify-center grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl-grid-cols-6"
	>
		{#each moveCollection as move}
			<a href={inModifyView ? undefined : `/move/${move.id}`} class="no-underline">
				<MoveCardEntry {move} isClickable={!inModifyView}>
					{#snippet remove()}
						<button
							class={`removeButton ${inModifyView ? '' : 'hidden'}`}
							onclick={async () => {
								await deleteMoveFromTag(move);
							}}
						>
							-
						</button>
					{/snippet}
				</MoveCardEntry>
			</a>
		{/each}
	</div>
{:else if moveCollection?.length > 0}
	<h2 class="h2 pb-0">Moves</h2>
	<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
		{#each moveCollection as move}
			<a href={inModifyView ? undefined : `/move/${move.id}`} class="no-underline">
				<MoveListEntry {move}>
					{#snippet remove()}
						<button
							class={`removeButton ${inModifyView ? '' : 'hidden'}`}
							onclick={async (e) => {
								await deleteMoveFromTag(move);
							}}>-</button
						>
					{/snippet}
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
