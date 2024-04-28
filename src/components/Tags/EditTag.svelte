<script lang="ts">
	import Modal from '$/components/UI/Modal.svelte';
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
	import type { ITagMoveNew } from '$lib/types/ITags';

	let showAddToOverlay = false;
	export let userId: string;
	export let pokemon: IDisplayPokemon | undefined = undefined;
	export let move: ITagMoveNew | undefined = undefined;
</script>

<button
	class="tag"
	on:click={() => {
		showAddToOverlay = true;
	}}>Edit</button
>

<Modal bind:showModal={showAddToOverlay}>
	<h2 class="h2" slot="header">Add and remove tags</h2>

	<div style="display: grid; gap: 1rem;">
		<p>Select the tags which this item should be attached to</p>

		<div style="display: grid;">
			{#each $tagStore as tag}
				<div>
					<input
						type="checkbox"
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
											variety: pokemon.variety
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
											variety: pokemon.variety
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

		<button
			class="button"
			style="width: 100%;"
			on:click={() => {
				showAddToOverlay = false;
			}}>Close</button
		>
	</div>
</Modal>

<style>
	.tag {
		display: inline-flex;
		gap: 0.25rem;
		font-size: smaller;
		background-color: var(--secondary);
		padding: 0.5rem;
		width: max-content;
		border-radius: 3rem;
		margin: 0.25rem;
		text-decoration: none;
	}
</style>
