<script lang="ts">
	import Modal from '$/ui/molecules/Modal/Modal.svelte';
	import Button from '$/ui/atoms/Button.svelte';
	import { currentUser } from '$/lib/stores/user';
	import { addNotification } from '$/features/notifications/notifications';
	import { invalidate } from '$app/navigation';
	import { DEPEND_ALL_TAGS, DEPEND_TAG_USER } from '$/features/tags/depends';
	import { createNewTag } from './api';

	let contents: Parameters<typeof createNewTag>[0]['contents'] = $props();

	let showModal: boolean = $state(false);

	let name = $state('');
	let isPrivate = $state(false);

	async function submit() {
		if (!$currentUser) {
			addNotification({
				message: `Authentication is invalid. Try signing out and in again`,
				level: 'failure'
			});
			return;
		}

		const status = await createNewTag({
			contents,
			showGenderAndShiny: true,
			name,
			isPrivate,
			isHiddenAcrossSite: false,
			description: ''
		});

		showModal = false;

		switch (status) {
			case 200:
			case 201:
				addNotification({
					message: `${name} has been created`,
					level: 'success'
				});
				invalidate(DEPEND_ALL_TAGS);

				invalidate(DEPEND_TAG_USER($currentUser.username));

				break;
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
				break;
		}
	}
</script>

{#if $currentUser}
	<Button
		classes="h-2 text-sm md:min-h-fit relative z-20"
		variant="accent"
		onclick={() => {
			showModal = true;
		}}
	>
		New Tag
	</Button>

	<Modal bind:showModal>
		{#snippet header()}
			<h2 class="h2">Create new tag</h2>
		{/snippet}

		<form
			class="grid gap-4 w-full pt-4"
			onsubmit={(e) => {
				e.preventDefault();
				submit();
			}}
		>
			<input type="text" class="w-full" placeholder="Tag name" bind:value={name} />

			<div class="inline-flex gap-2 justify-center">
				<input
					type="checkbox"
					id="isPrivate"
					class="nested"
					onchange={(e) => {
						isPrivate = e.currentTarget.checked;
					}}
				/>
				<label for="isPrivate">Hidden for other users</label>
			</div>

			<div class="inline-flex w-full justify-between pt-8">
				<Button
					variant="secondary"
					onclick={() => {
						showModal = false;
					}}>Close</Button
				>
				<Button variant="accent" type="submit">Create</Button>
			</div>
		</form>
	</Modal>
{/if}

<style>
	input[type='text'] {
		height: 100%;
		padding: 10px;
		padding-left: 1rem;
		padding-right: 1rem;
	}
</style>
