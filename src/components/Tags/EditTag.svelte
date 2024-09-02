<script lang="ts">
	import Modal from '$/ui/molecules/Modal/Modal.svelte';
	import type { ITagMove } from '$/lib/types/ITags';
	import Button from '$/ui/atoms/button/Button.svelte';
	import { type IDisplayPokemon } from '$lib/stores/pokemonPage';
	import {
		addMoveToTag,
		addPokemonToTag,
		doesTagContainMove,
		doesTagContainPokemon,
		refetchTags,
		removeMoveFromTag,
		removePokemonFromTag,
		tagStore
	} from '$lib/stores/tags';

	let showAddToOverlay = false;
	export let userId: string;
	export let pokemon: IDisplayPokemon | undefined = undefined;
	export let move: ITagMove | undefined = undefined;
</script>

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
						checked={pokemon
							? doesTagContainPokemon(pokemon, tag)
							: move
							? doesTagContainMove(move.id, tag)
							: false}
						on:change={async (e) => {
							if (e.currentTarget.checked) {
								if (pokemon) {
									await addPokemonToTag(
										{
											id: pokemon.id,
											gender: pokemon.gender,
											shiny: pokemon.hasShinySprite && pokemon.showShinySpriteIfExists,
											variety: pokemon.variety,
											added: new Date().toISOString()
										},
										tag.id
									);
								} else if (move) {
									await addMoveToTag(move, tag.id);
								}

								await refetchTags(userId);
							} else {
								if (pokemon) {
									await removePokemonFromTag(
										{
											id: pokemon.id,
											gender: pokemon.gender,
											shiny: pokemon.hasShinySprite && pokemon.showShinySpriteIfExists,
											variety: pokemon.variety,
											added: new Date().toISOString()
										},
										tag.id
									);
								} else if (move) {
									await removeMoveFromTag(move, tag.id);
								}
								await refetchTags(userId);
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
