<script lang="ts">
	import type { SignedInUser } from '$lib/stores/user';
	import Icon from './Icon.svelte';
	import Modal from './Modal.svelte';

	// export let user: SignedInUser;
	const tags = ['Shinies', 'Cute', 'Shield', 'Caught', 'Seen', 'Plushie'];

	let showModal = false;
	const addNew = () => {};
</script>

<div
	style="padding-top: 1rem; display: flex; justify-content: center; width: 100%; flex-flow: wrap;"
>
	{#each tags as tag}
		<a class="tag" href="/user/me/list">
			<Icon style="margin-top: auto; margin-bottom: auto;" name="tag" />
			<p>{tag}</p>
		</a>
	{/each}
	<button
		class="tag"
		on:click={() => {
			showModal = true;
		}}>Add New</button
	>
</div>

<Modal bind:showModal>
	<h2 slot="header">Create new list</h2>

	<p style="padding-top: 1rem;">The current item will be added to it after it's created</p>
	<form>
		<input type="text" placeholder="List name" />
		<button>Create</button>
	</form>
</Modal>

<style>
	.tag {
		display: inline-flex;
		gap: 0.25rem;
		font-size: smaller;
		background-color: var(--secondary);
		padding: 0.5rem;
		width: max-content;
		border-radius: 3rem;
		margin: 0.25rem;
		text-decoration: none;
	}

	form {
		display: inline-flex;
		height: 100%;
		width: 100%;
		padding-top: 1rem;
		justify-content: center;
	}

	form > input {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	form > button {
		border-top-right-radius: 0.25rem;
		border-bottom-right-radius: 0.25rem;
		background-color: var(--accent);
		height: 100%;
		padding: 5px;
		min-width: max-content;
	}
</style>
