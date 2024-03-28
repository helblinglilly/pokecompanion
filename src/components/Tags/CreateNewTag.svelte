<script lang="ts">
	import InlineTextButton from '$components/InlineTextButton.svelte';
	import Modal from '$components/UI/Modal.svelte';
	import { createTag } from '$lib/stores/tags';
	import type { ITagMove, ITagMoveNew, ITagPokemon, ITagPokemonNew } from '$lib/types/ITags';

	export let userId: string;
	export let initialContent: {
		pokemon?: ITagPokemonNew[];
		move?: ITagMoveNew[];
	};
	export let onSuccess = ({
		user,
		name,
		isPrivate
	}: {
		user: string;
		name: string;
		isPrivate: boolean;
	}) => {
		window?.newrelic?.addPageAction('TagCreated', {
			user,
			name,
			isPrivate
		});
	};

	let mappedPokemon: ITagPokemon[] = [];
	let mappedMoves: ITagMove[] = [];
	let showAddNewOverlay: boolean;
	let newListName: string;
	let isPrivate: boolean;
</script>

<button
	class="tag"
	on:click={() => {
		showAddNewOverlay = true;
	}}
>
	New Tag
</button>

<Modal bind:showModal={showAddNewOverlay}>
	<h2 class="h2" slot="header">Create new tag</h2>

	{#if Object.keys(initialContent).length > 0}
		<p style="padding-top: 1rem;">The current item will be added to it after it's created</p>
	{/if}
	<form>
		<div id="newTagName">
			<InlineTextButton
				bind:valueBinding={newListName}
				variation="small"
				buttonConfig={{
					text: 'Create',
					onClick: async () => {
						if (initialContent.pokemon) {
							mappedPokemon = initialContent.pokemon.map((mon) => {
								return {
									...mon,
									added: new Date().toISOString()
								};
							});
						}
						if (initialContent.move) {
							mappedMoves = initialContent.move.map((move) => {
								return {
									...move,
									added: new Date().toISOString()
								};
							});
						}
						await createTag(userId, newListName, isPrivate, {
							pokemon: mappedPokemon,
							move: mappedMoves
						});
						showAddNewOverlay = false;
						newListName = '';
						onSuccess({
							user: userId,
							name: newListName,
							isPrivate
						});
					}
				}}
				inputConfig={{ placeholder: 'Tag name' }}
				containerStyling="width: 70%;"
			/>
		</div>
		<div>
			<input
				type="checkbox"
				id="isPrivate"
				on:change={(e) => {
					isPrivate = e.currentTarget.checked;
				}}
			/>
			<label style="padding-left: 0.5rem;" for="isPrivate">Private tag</label>
		</div>
	</form>
</Modal>

<style>
	form > div {
		display: inline-flex;
		height: 100%;
		width: 100%;
		padding-top: 1rem;
		justify-content: center;
	}

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
