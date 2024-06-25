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

<hr />

<button class="button primary" on:click={() => (showRenameOverlay = !showRenameOverlay)}
	>Rename</button
>

<button class="button primary" on:click={() => (showDescriptionOverlay = !showDescriptionOverlay)}
	>Edit Description</button
>

<button
	class="button primary"
	on:click={() => {
		patchTag({ ...$tag, showGenderAndShiny: !$tag.showGenderAndShiny }).then((newTag) => {
			if (newTag) {
				tag.set(newTag);
			}
		});
	}}>{$tag.showGenderAndShiny ? 'Hide' : 'Show'} Gender/Shiny icons</button
>

<button
	class="button primary"
	on:click={() => {
		patchTag({ ...$tag, isPrivate: !$tag.isPrivate }).then((newTag) => {
			if (newTag) {
				tag.set(newTag);
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

				patchTag({ ...$tag, name: newVal }).then((newTag) => {
					if (newTag) {
						tag.set(newTag);
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

				patchTag({ ...$tag, description: newVal }).then((newTag) => {
					if (newTag) {
						tag.set(newTag);
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
