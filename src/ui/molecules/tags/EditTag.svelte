<script lang="ts">
	import Modal from '$/ui/molecules/Modal/Modal.svelte';
	import Button from '$/ui/atoms/Button.svelte';
	import { currentUser } from '$/lib/stores/user';
	import { addNotification } from '$/features/notifications/notifications';
	import { PUBLIC_API_HOST } from '$env/static/public';
	import type { paths } from '$/@types/api';
	import { invalidate } from '$app/navigation';
	import { doesTagPokemonContainPokemon } from '$/features/tags/utils/containsPokemon';
	import { doesTagMoveContainMove } from '$/features/tags/utils/containsMove';
	import { page } from '$app/state';
	import type { LayoutData } from '../../../routes/$types';
	import type { MinimalTagMove, MinimalTagPokemon } from '$/features/tags/types';

	let showAddToOverlay = $state(false);
	interface Props {
		pokemon?: MinimalTagPokemon | undefined;
		move?: MinimalTagMove | undefined;
	}

	let { pokemon = undefined, move = undefined }: Props = $props();

	let pokemonBody = $derived(
		():
			| paths['/tags/{tagId}/pokemon']['post']['requestBody']['content']['application/json']
			| undefined => {
			if (!pokemon) {
				return;
			}
			return {
				id: pokemon.id,
				gender: pokemon.gender,
				shiny: pokemon.shiny,
				variety: pokemon.variety
			};
		}
	);

	async function modifyEntryOnTag(tagId: string, action: 'add' | 'remove') {
		let body = '';
		let route = '';

		if (pokemon) {
			body = JSON.stringify(pokemonBody());
			route = PUBLIC_API_HOST + `/tags/${tagId}/pokemon`;
		}

		if (move) {
			body = JSON.stringify({
				moveId: move?.id
			});
			route = PUBLIC_API_HOST + `/tags/${tagId}/move`;
		}

		const res = await fetch(route, {
			method: action === 'add' ? 'POST' : 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body
		});
		return res.ok;
	}

	const layoutData = $derived(page.data as LayoutData);
</script>

{#if $currentUser}
	<Button
		classes="tag h-2 md:min-h-fit relative z-20"
		style="font-size: smaller;"
		onclick={() => {
			showAddToOverlay = true;
		}}
	>
		Edit
	</Button>

	<Modal bind:showModal={showAddToOverlay}>
		{#snippet header()}
			<h2 class="h2">Add and remove tags</h2>
		{/snippet}

		<div class="grid gap-4">
			<p>Select the tags which this item should be attached to</p>
			<div class="grid gap-2">
				{#each layoutData.tags.tags as tag}
					<div class="inline-flex">
						<input
							type="checkbox"
							class="nested"
							id={tag.name}
							checked={doesTagPokemonContainPokemon(tag.contents.pokemon, pokemon) ||
								doesTagMoveContainMove(tag.contents.move, move)}
							onchange={async (e) => {
								const success = await modifyEntryOnTag(
									tag.id,
									e.currentTarget.checked ? 'add' : 'remove'
								);

								if (success) {
									invalidate(`tag:${tag.id}`);
								} else {
									addNotification({
										message: `Failed to modify tag "${tag.name}""`,
										level: 'failure'
									});
									showAddToOverlay = false;
								}
							}}
						/>
						<label for={tag.name}>{tag.name}</label>
					</div>
				{/each}
			</div>

			<Button
				classes="w-full"
				variant="primary"
				onclick={() => {
					showAddToOverlay = false;
				}}
			>
				Close
			</Button>
		</div>
	</Modal>
{/if}
