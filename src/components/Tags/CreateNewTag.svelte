<script lang="ts">
	import Modal from '$components/Modal.svelte';
	import type { ITagRequestBody, ITagContents } from '$lib/types/ITags';

	export let newTagInitialContent: ITagContents;
	export let showAddNewOverlay: boolean;

	let newListName: string;
	let isPrivate: boolean = false;

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
			<input type="text" placeholder="Tag name" bind:value={newListName} />
			<button on:click={createNewTag}>Create</button>
		</div>
		<div>
			<input type="checkbox" id="isPrivate" bind:value={isPrivate} />
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

	form > #newTagName > input {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	form > #newTagName > button {
		border-top-right-radius: 0.25rem;
		border-bottom-right-radius: 0.25rem;
		background-color: var(--accent);
		height: 100%;
		padding: 5px;
		min-width: max-content;
	}
</style>
