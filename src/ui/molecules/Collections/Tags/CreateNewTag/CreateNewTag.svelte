<script lang="ts">
	import Modal from '$/ui/molecules/Modal/Modal.svelte';
	import Button from '$/ui/atoms/button/Button.svelte';
	import { Logger } from '$lib/log';
	import type { ITagInitial, ITagMove, ITagPokemonInitial } from '$/routes/api/tag/types';
	import { currentUser } from '$/lib/stores/user';
	import { addNotification } from '$/lib/stores/notifications';
	import { refetchTags } from '$/lib/stores/tags';
	import { createEventDispatcher } from 'svelte';

	export let pokemon: ITagPokemonInitial | undefined = undefined;
	export let move: ITagMove | undefined = undefined;

	const dispatch = createEventDispatcher();

	let showAddNewOverlay: boolean;

	let name: string;
	let isPrivate: boolean;

	$: requestBody = (): ITagInitial => ({
		name,
		isPrivate,
		description: '',
		isHiddenAcrossSite: false,
		showShinyAndGender: true,
		contents: {
			pokemon: pokemon ? [pokemon] : [],
			move: move ? [move] : []
		}
	});
</script>

{#if $currentUser}
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
			<div class="inline-flex gap-2 justify-center">
				<input type="text" class="w-6/12" placeholder="Tag name" bind:value={name} />
				<Button
					variant="accent"
					on:click={async () => {
						const res = await fetch(`/api/tag`, {
							method: 'POST',
							body: JSON.stringify(requestBody())
						});

						if (res.ok) {
							Logger.addPageAction('TagCreated', name, {
								user: $currentUser.id,
								name,
								isPrivate
							});

							addNotification({
								message: `${name} has been created`,
								level: 'success'
							});

							refetchTags($currentUser.username);
							dispatch('success', requestBody);
						} else {
							addNotification({
								message: `Failed to create "${name}"`,
								level: 'failure'
							});
						}

						showAddNewOverlay = false;
						name = '';
						isPrivate = false;
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
{/if}
