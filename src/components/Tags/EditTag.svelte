<script lang="ts">
	import Modal from '$components/Modal.svelte';
	import { pokemonDisplayStore } from '$lib/stores/pokemonPageStore';
	import {
		addPokemonToTag,
		doesTagContainPokemon,
		refetchTags,
		removePokemonFromTag,
		tagStore
	} from '$lib/stores/tagsStore';

	let showAddToOverlay = false;
	export let userId: string;
</script>

<button
	class="tag"
	on:click={() => {
		showAddToOverlay = true;
	}}>Edit</button
>

<Modal bind:showModal={showAddToOverlay}>
	<h2 slot="header">Add and remove tags</h2>

	<div style="display: grid; gap: 1rem;">
		<p>Select the tags which this item should be attached to</p>

		<div style="display: grid;">
			{#each $tagStore as tag}
				<div>
					<input
						type="checkbox"
						id={tag.name}
						checked={doesTagContainPokemon($pokemonDisplayStore, tag)}
						on:change={async (e) => {
							if (e.currentTarget.checked) {
								await addPokemonToTag(
									{
										id: $pokemonDisplayStore.id,
										gender: $pokemonDisplayStore.gender,
										shiny:
											$pokemonDisplayStore.hasShinySprite &&
											$pokemonDisplayStore.showShinySpriteIfExists
									},
									tag.id
								);
								await refetchTags(userId);
							} else {
								await removePokemonFromTag(
									{
										id: $pokemonDisplayStore.id,
										gender: $pokemonDisplayStore.gender,
										shiny:
											$pokemonDisplayStore.hasShinySprite &&
											$pokemonDisplayStore.showShinySpriteIfExists
									},
									tag.id
								);
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
