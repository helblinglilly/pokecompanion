<script lang="ts">
	import Modal from '$/ui/molecules/Modal/Modal.svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { deleteTag, patchTag } from './helper';
	import { goto } from '$app/navigation';
	import { currentUser } from '$/lib/stores/user';
	import Button from '$/ui/atoms/button';
	import type { APITag } from '$/@types/api.pokecompanion';
	import { refetchTags } from '$/lib/stores/tags';

	let showRenameOverlay = false;
	let showDescriptionOverlay = false;
	let showDeleteOverlay = false;
	let tag = getContext('tag') as Writable<APITag['tags'][number]>;

	let newName = $tag.name;
	let newDescription = $tag.description;
</script>

<Button variant="primary" on:click={() => (showRenameOverlay = !showRenameOverlay)}>Rename</Button>

<Button variant="primary" on:click={() => (showDescriptionOverlay = !showDescriptionOverlay)}>
	Edit Description
</Button>

<Button
	variant="primary"
	on:click={() => {
		const optimisticTag = { ...$tag, showGenderAndShiny: !$tag.showGenderAndShiny };
		const originalTag = { ...$tag };

		tag.set(optimisticTag);

		patchTag(optimisticTag).then((newTag) => {
			if (newTag) {
				tag.set(newTag);
			} else {
				tag.set(originalTag);
			}
		});
	}}
>
	{$tag.showGenderAndShiny ? 'Hide' : 'Show'} Gender/Shiny
</Button>

<Button
	variant="primary"
	on:click={() => {
		const optimisticTag = { ...$tag, isPrivate: !$tag.isPrivate };
		const originalTag = { ...$tag };

		tag.set(optimisticTag);

		patchTag(optimisticTag).then((newTag) => {
			if (newTag) {
				tag.set(newTag);
			} else {
				tag.set(originalTag);
			}
		});
	}}
>
	Make {$tag.isPrivate ? 'Public' : 'Private'}
</Button>

<Button
	variant="primary"
	on:click={() => {
		const optimisticTag = { ...$tag, isHiddenAcrossSite: !$tag.isHiddenAcrossSite };
		const originalTag = { ...$tag };

		tag.set(optimisticTag);

		patchTag(optimisticTag)
			.then((newTag) => {
				if (newTag) {
					tag.set(newTag);
				} else {
					tag.set(originalTag);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}}
>
	{$tag.isHiddenAcrossSite ? 'Show' : 'Hide'} on site
</Button>

<Button classes="error" on:click={() => (showDeleteOverlay = !showDeleteOverlay)}>Delete Tag</Button
>

<Modal bind:showModal={showRenameOverlay} classes="md:w-[30rem]">
	<h2 class="h2" slot="header">Rename Tag</h2>

	<div class="grid gap-4 md:px-8 md:pt-8">
		<input type="text" placeholder="New name" bind:value={newName} />

		<Button
			on:click={() => {
				if (!newName) {
					return;
				}
				showRenameOverlay = false;

				const optimisticTag = { ...$tag, name: newName };
				const originalTag = { ...$tag };
				tag.set(optimisticTag);

				patchTag(optimisticTag).then((newTag) => {
					if (newTag) {
						tag.set(newTag);
					} else {
						tag.set(originalTag);
					}
				});
			}}>Rename</Button
		>
	</div>
</Modal>

<Modal bind:showModal={showDescriptionOverlay} classes="md:w-[30rem]">
	<h2 class="h2" slot="header">Edit Description</h2>

	<div class="grid gap-4 md:px-8 md:pt-8">
		<textarea placeholder={$tag.description} bind:value={newDescription} />

		<Button
			on:click={() => {
				if (!newDescription) {
					return;
				}
				showDescriptionOverlay = false;

				const optimisticTag = { ...$tag, description: newDescription };
				const originalTag = { ...$tag };
				tag.set(optimisticTag);

				patchTag(optimisticTag).then((newTag) => {
					if (newTag) {
						tag.set(newTag);
					} else {
						tag.set(originalTag);
					}
				});
			}}>Save</Button
		>
	</div>
</Modal>

<Modal bind:showModal={showDeleteOverlay} classes="md:w-[30rem]">
	<h2 class="h2" slot="header">Delete Tag</h2>

	<div class="mt-4 grid gap-4 text-center">
		<p>Are you sure you want to delete "{$tag.name}"?</p>

		<div
			style="display: inline-flex; width: 100%; justify-content: space-between; padding: 0.5rem;"
		>
			<Button
				classes="error"
				on:click={async () => {
					await deleteTag($tag.id);
					if ($currentUser?.id) {
						await refetchTags($currentUser?.id);
					}
					goto(`/user/${$currentUser?.username}`);
				}}>Yes, delete</Button
			>
			<Button on:click={() => (showDeleteOverlay = false)}>No, go back!</Button>
		</div>
	</div>
</Modal>
