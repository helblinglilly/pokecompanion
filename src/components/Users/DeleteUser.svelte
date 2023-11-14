<script lang="ts">
	import { goto } from '$app/navigation';
	import Modal from '$components/Modal.svelte';
	import { pb } from '$lib/pocketbase';
	import type { SignedInUser } from '$lib/stores/user';

	let showModal = false;
	export let user: SignedInUser;

	const onDeleteClick = async () => {
		await pb.collection('users').delete(user.id);
		pb.authStore.clear();
		goto('/');
	};
</script>

<button class="button error" on:click={() => (showModal = true)}> Delete my account </button>

<Modal bind:showModal>
	<h2 slot="header">Confirm deletion?</h2>

	<div style="margin-top: 1rem;">
		<p>Are you sure you want to delete your user account?</p>

		<div
			style="display: inline-flex; width: 100%; justify-content: space-between; padding: 0.5rem;"
		>
			<button class="button error" on:click={onDeleteClick}>Yes, delete</button>
			<button class="button" on:click={() => (showModal = false)}>No, go back!</button>
		</div>
	</div>
</Modal>
