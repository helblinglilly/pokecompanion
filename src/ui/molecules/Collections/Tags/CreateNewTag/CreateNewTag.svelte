<script lang="ts">
	import InlineTextButton from '$/components/InlineTextButton.svelte';
	import Modal from '$/ui/molecules/Modal/Modal.svelte';
	import Button from '$/ui/atoms/button/Button.svelte';
	import { Logger } from '$lib/log';
	import { createTag } from '$lib/stores/tags';
	import type { ITagMove, ITagPokemon } from '$lib/types/ITags';
	import type { IRecordPokemon } from '$/lib/types/IPokemon';

	export let userId: string;
	export let initialContent: {
		pokemon?: IRecordPokemon[];
		move?: ITagMove[];
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
		Logger.addPageAction('TagCreated', '', {
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

<Button
	classes="h-2 text-sm md:min-h-fit relative z-20"
	variant="accent"
	on:click={() => {
		showAddNewOverlay = true;
	}}
>
	New Tag
</Button>

<Modal bind:showModal={showAddNewOverlay}>
	<h2 class="h2" slot="header">Create new tag</h2>

	<form class="grid gap-4 w-full">
		{#if Object.keys(initialContent).length > 0}
			<p class="text-center pt-4">The current item will be added to it after it's created</p>
		{/if}

		<div class="inline-flex gap-2 justify-center">
			<input type="text" class="w-6/12" placeholder="Tag name" bind:value={newListName} />
			<Button
				variant="accent"
				on:click={async () => {
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
				}}>Create</Button
			>
		</div>

		<div class="inline-flex gap-2 justify-center">
			<input
				type="checkbox"
				id="isPrivate"
				class="nested"
				on:change={(e) => {
					isPrivate = e.currentTarget.checked;
				}}
			/>
			<label for="isPrivate">Private tag</label>
		</div>
	</form>
</Modal>

<style>
	/* form > div {
		display: inline-flex;
		height: 100%;
		width: 100%;
		padding-top: 1rem;
		justify-content: center;
	} */
</style>
