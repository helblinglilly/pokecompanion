<script lang="ts">
	import Modal from '$/ui/molecules/Modal/Modal.svelte';
	import Button from '$/ui/atoms/Button.svelte';
	import {
		doesTagContainMove,
		doesTagContainPokemon,
		refetchTags,
		tagStore
	} from '$/lib/stores/tags';
	import type { IDisplayPokemon } from '$/lib/stores/pokemonPage';
	import { currentUser } from '$/lib/stores/user';
	import { addNotification } from '$/lib/stores/notifications';
	import { PUBLIC_API_HOST } from '$env/static/public';
	import type { ITagMove } from '$/@types/api.pokecompanion';
	import type { paths } from '$/@types/api';
	import { invalidate } from '$app/navigation';

	let showAddToOverlay = $state(false);
	interface Props {
		pokemon?: IDisplayPokemon | undefined;
		move?: Omit<ITagMove, 'added'> | undefined;
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
				shiny: pokemon.hasShinySprite && pokemon.showShinySpriteIfExists,
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
				{#each $tagStore as tag}
					<div class="inline-flex">
						<input
							type="checkbox"
							class="nested"
							id={tag.name}
							checked={doesTagContainPokemon(pokemon, tag) || doesTagContainMove(move, tag)}
							onchange={async (e) => {
								const success = await modifyEntryOnTag(
									tag.id,
									e.currentTarget.checked ? 'add' : 'remove'
								);

								if (success) {
									invalidate(`tag:${tag.id}`);
									await refetchTags($currentUser?.id);
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
