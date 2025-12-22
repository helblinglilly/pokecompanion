<script lang="ts">
	import Modal from '$/ui/molecules/Modal/Modal.svelte';
	import { deleteTag, patchTag } from './helper';
	import { goto } from '$app/navigation';
	import { currentUser } from '$/lib/stores/user';
	import Button from '$/ui/atoms/Button.svelte';
	import type { APITag } from '$/@types/api.pokecompanion';

	let showRenameOverlay = $state(false);
	let showDescriptionOverlay = $state(false);
	let showDeleteOverlay = $state(false);
	let { tag }: { tag: APITag['tags'][number] } = $props();

	let newName = $derived(tag.name);
	let newDescription = $derived(tag.description);
</script>

<Button variant="primary" onclick={() => (showRenameOverlay = !showRenameOverlay)}>Rename</Button>

<Button variant="primary" onclick={() => (showDescriptionOverlay = !showDescriptionOverlay)}>
	Edit Description
</Button>

<Button
	variant="primary"
	onclick={async () => {
		await patchTag({ ...tag, isPrivate: !tag.isPrivate });
	}}
>
	Make {tag.isPrivate ? 'Public' : 'Private'}
</Button>

<Button
	variant="primary"
	onclick={async () => {
		await patchTag({ ...tag, isHiddenAcrossSite: !tag.isHiddenAcrossSite });
	}}
>
	{tag.isHiddenAcrossSite ? 'Show' : 'Hide'} on site
</Button>

<Button classes="error" onclick={() => (showDeleteOverlay = !showDeleteOverlay)}>Delete Tag</Button>

<Modal bind:showModal={showRenameOverlay}>
	{#snippet header()}
		<h2 class="h2">Rename Tag</h2>
	{/snippet}

	<div class="grid gap-4 md:px-8 md:pt-8">
		<input type="text" placeholder="New name" bind:value={newName} />

		<Button
			onclick={async () => {
				if (!newName) {
					return;
				}
				showRenameOverlay = false;

				patchTag({ ...tag, name: newName });
			}}>Rename</Button
		>
	</div>
</Modal>

<Modal bind:showModal={showDescriptionOverlay}>
	{#snippet header()}
		<h2 class="h2">Edit Description</h2>
	{/snippet}

	<div class="grid gap-4 md:px-8 md:pt-8">
		<textarea placeholder={tag.description} bind:value={newDescription}></textarea>

		<Button
			onclick={async () => {
				if (!newDescription) {
					return;
				}
				showDescriptionOverlay = false;

				await patchTag({ ...tag, description: newDescription });
			}}>Save</Button
		>
	</div>
</Modal>

<Modal bind:showModal={showDeleteOverlay}>
	{#snippet header()}
		<h2 class="h2">Delete Tag</h2>
	{/snippet}

	<div class="mt-4 grid gap-4 text-center">
		<p>Are you sure you want to delete "{tag.name}"?</p>

		<div
			style="display: inline-flex; width: 100%; justify-content: space-between; padding: 0.5rem;"
		>
			<Button
				classes="error"
				onclick={async () => {
					await deleteTag(tag.id);
					goto(`/user/${$currentUser?.username}`);
				}}>Yes, delete</Button
			>
			<Button onclick={() => (showDeleteOverlay = false)}>No, go back!</Button>
		</div>
	</div>
</Modal>
