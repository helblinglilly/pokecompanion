<script lang="ts">
	import InlineTextButton from '$components/InlineTextButton.svelte';
	import Modal from '$components/Modal.svelte';
	import type { ITagRequestBody, ITagContents } from '$lib/types/ITags';

	export let newTagInitialContent: ITagContents;
	export let showAddNewOverlay: boolean;
	export let afterCreation: () => void;

	let newListName: string;
	let isPrivate: boolean;

	const createNewTag = async () => {
		try {
			const payload: ITagRequestBody = {
				name: newListName,
				initialContent: newTagInitialContent,
				isPrivate
			};
			const response = await fetch('/api/tags', {
				method: 'POST',
				body: JSON.stringify(payload)
			});
			if (!response.ok) {
				throw new Error(`Failed to create new tag`);
			}

			if (afterCreation) {
				afterCreation();
			}
		} catch (err) {
			console.log(err);
		}
		showAddNewOverlay = false;
		newListName = '';
	};
</script>

<Modal bind:showModal={showAddNewOverlay}>
	<h2 slot="header">Create new tag</h2>

	<p style="padding-top: 1rem;">The current item will be added to it after it's created</p>
	<form>
		<div id="newTagName">
			<InlineTextButton
				variation="small"
				buttonConfig={{ text: 'Create', onClick: createNewTag }}
				inputConfig={{ valueBind: newListName, placeholder: 'Tag name' }}
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
</style>
