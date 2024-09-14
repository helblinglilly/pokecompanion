<script lang="ts">
	import Modal from '$/ui/molecules/Modal/Modal.svelte';
	import Button from '$/ui/atoms/button/Button.svelte';
	import {
		doesTagContainMove,
		doesTagContainPokemon,
		refetchTags,
		tagStore
	} from '$/lib/stores/tags';
	import type { ITagMove } from '$/routes/api/tag/types';
	import type { IDisplayPokemon } from '$/lib/stores/pokemonPage';
	import type { IRecordPokemon } from '$/lib/types/IPokemon';
	import { currentUser } from '$/lib/stores/user';
	import { addNotification } from '$/lib/stores/notifications';

	let showAddToOverlay = false;
	export let pokemon: IDisplayPokemon | undefined = undefined;
	export let move: Omit<ITagMove, 'added'> | undefined = undefined;

	$: pokemonBody = (): IRecordPokemon | undefined => {
		if (!pokemon) {
			return;
		}
		return {
			id: pokemon.id,
			gender: pokemon.gender,
			shiny: pokemon.hasShinySprite && pokemon.showShinySpriteIfExists,
			variety: pokemon.variety
		};
	};

	async function modifyEntryOnTag(tagId: string, action: 'add' | 'remove') {
		let body: string = '';
		let route: string = '';

		if (pokemon) {
			body = JSON.stringify(pokemonBody());
			route = `/api/tag/${tagId}/pokemon`;
		}

		if (move) {
			body = JSON.stringify(move);
			route = `/api/tag/${tagId}/move`;
		}

		const res = await fetch(route, {
			method: action === 'add' ? 'POST' : 'DELETE',
			body
		});
		return res.ok;
	}
</script>

{#if $currentUser}
	<Button
		classes="tag h-2 md:min-h-fit relative z-20"
		style="font-size: smaller;"
		on:click={() => {
			showAddToOverlay = true;
		}}
	>
		Edit
	</Button>

	<Modal bind:showModal={showAddToOverlay}>
		<h2 class="h2" slot="header">Add and remove tags</h2>

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
							on:change={async (e) => {
								const success = await modifyEntryOnTag(
									tag.id,
									e.currentTarget.checked ? 'add' : 'remove'
								);

								if (success) {
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
				on:click={() => {
					showAddToOverlay = false;
				}}
			>
				Close
			</Button>
		</div>
	</Modal>
{/if}
