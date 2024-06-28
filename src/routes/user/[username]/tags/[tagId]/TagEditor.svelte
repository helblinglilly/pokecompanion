<script lang="ts">
	import InlineTextButton from '$/components/InlineTextButton.svelte';
	import Modal from '$/components/UI/Modal.svelte';
	import type { TagRecord } from '$/lib/types/ITags';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { deleteTag, patchTag } from './helper';
	import { goto } from '$app/navigation';
	import { currentUser } from '$/lib/stores/user';

	let showRenameOverlay = false;
	let showDescriptionOverlay = false;
	let showDeleteOverlay = false;
	let tag = getContext('tag') as Writable<TagRecord>;
</script>

<button class="button primary" on:click={() => (showRenameOverlay = !showRenameOverlay)}
	>Rename</button
>

<button class="button primary" on:click={() => (showDescriptionOverlay = !showDescriptionOverlay)}
	>Edit Description</button
>

<button
	class="button primary"
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
	}}>{$tag.showGenderAndShiny ? 'Hide' : 'Show'} Gender/Shiny</button
>

<button
	class="button primary"
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
	}}>Make {$tag.isPrivate ? 'Public' : 'Private'}</button
>

<button class="button error" on:click={() => (showDeleteOverlay = !showDeleteOverlay)}
	>Delete Tag</button
>

<Modal bind:showModal={showRenameOverlay}>
	<h2 class="h2" slot="header">Rename Tag</h2>

	<InlineTextButton
		buttonConfig={{
			text: 'Rename',
			onClick: (newVal) => {
				if (!newVal) {
					return;
				}
				showRenameOverlay = false;

				const optimisticTag = { ...$tag, name: newVal };
				const originalTag = { ...$tag };
				tag.set(optimisticTag);

				patchTag(optimisticTag).then((newTag) => {
					if (newTag) {
						tag.set(newTag);
					} else {
						tag.set(originalTag);
					}
				});
			}
		}}
		variation="small"
		containerStyling="padding: 1rem;"
		inputConfig={{ placeholder: 'New name' }}
		valueBinding={$tag.name}
	/>
</Modal>

<Modal bind:showModal={showDescriptionOverlay}>
	<h2 class="h2" slot="header">Edit Description</h2>

	<InlineTextButton
		buttonConfig={{
			text: 'Save',
			onClick: (newVal) => {
				if (!newVal) {
					return;
				}
				showDescriptionOverlay = false;

				const optimisticTag = { ...$tag, description: newVal };
				const originalTag = { ...$tag };
				tag.set(optimisticTag);

				patchTag(optimisticTag).then((newTag) => {
					if (newTag) {
						tag.set(newTag);
					} else {
						tag.set(originalTag);
					}
				});
			}
		}}
		variation="small"
		containerStyling="padding: 1rem;"
		inputConfig={{
			placeholder: $tag.description.length > 1 ? $tag.description : 'Description...'
		}}
		valueBinding={$tag.description}
	/>
</Modal>

<Modal bind:showModal={showDeleteOverlay}>
	<h2 class="h2" slot="header">Delete Tag</h2>

	<div style="margin-top: 1rem;">
		<p>Are you sure you want to to delete "{$tag.name}"?</p>

		<div
			style="display: inline-flex; width: 100%; justify-content: space-between; padding: 0.5rem;"
		>
			<button
				class="button error"
				on:click={() => {
					deleteTag($tag).then(() => {
						goto(`/user/${$currentUser?.username}`);
					});
				}}>Yes, delete</button
			>
			<button class="button" on:click={() => (showDeleteOverlay = false)}>No, go back!</button>
		</div>
	</div>
</Modal>
