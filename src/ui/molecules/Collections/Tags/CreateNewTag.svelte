<script lang="ts">
	import Modal from '$/ui/molecules/Modal/Modal.svelte';
	import Button from '$/ui/atoms/button/Button.svelte';
	import { currentUser } from '$/lib/stores/user';
	import { addNotification } from '$/lib/stores/notifications';
	import { refetchTags } from '$/lib/stores/tags';
	import { createEventDispatcher } from 'svelte';
	import { PUBLIC_API_HOST } from '$env/static/public';
	import type { paths } from '$/@types/api';
	import type { APITagCreateRequestBody } from '$/@types/api.pokecompanion';

	export let pokemon: NonNullable<APITagCreateRequestBody['pokemon']>[number] | undefined =
		undefined;
	export let move: NonNullable<APITagCreateRequestBody['move']>[number] | undefined = undefined;

	const dispatch = createEventDispatcher();

	let showAddNewOverlay: boolean;

	let name: string;
	let isPrivate: boolean;

	$: requestBody = (): paths['/tags']['post']['requestBody']['content']['application/json'] => ({
		name,
		isPrivate: !!isPrivate,
		description: '',
		isHiddenAcrossSite: false,
		showGenderAndShiny: true,
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
						const res = await fetch(`${PUBLIC_API_HOST}/tags`, {
							method: 'POST',
							body: JSON.stringify(requestBody()),
							headers: {
								'Content-Type': 'application/json'
							},
							credentials: 'include'
						});

						if (res.status === 201) {
							addNotification({
								message: `${name} has been created`,
								level: 'success'
							});

							refetchTags($currentUser.id);
							dispatch('success', requestBody);
							showAddNewOverlay = false;
							return;
						}

						switch (res.status) {
							case 401:
								addNotification({
									message: `Authentication is invalid. Try signing out and in again`,
									level: 'failure'
								});
								break;
							case 409:
								addNotification({
									message: `A tag with this name already exists. Please choose a different name`,
									level: 'failure'
								});
								break;
							default:
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
