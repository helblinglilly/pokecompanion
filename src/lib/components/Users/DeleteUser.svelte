<script lang="ts">
	import { goto } from '$app/navigation';
	import { addNotification } from '$lib/stores/notifications';
	import { currentUser } from '$lib/stores/user';
	import { deleteCookie } from '$lib/utils/cookies';
	import Button from '$/ui/atoms/button/Button.svelte';
	import Modal from '$/ui/molecules/Modal/Modal.svelte';
	import { PUBLIC_API_HOST } from '$env/static/public';

	let showModal = false;

	const onDeleteClick = async () => {
		try {
			const res = await fetch(`${PUBLIC_API_HOST}/user`, {
				method: 'DELETE',
				credentials: 'include'
			});
			if (res.status !== 204) {
				throw new Error(`Non-204 status code for deleting a user ${res.status}`);
			}

			currentUser.set(null);
			deleteCookie('pb_auth');
			goto('/');
		} catch (err) {
			addNotification({
				message:
					'Failed to delete user account. Please contact pokecompanion@helbling.uk to delete your account.',
				level: 'failure'
			});
		}
	};
</script>

<Button classes="error" on:click={() => (showModal = true)}>Delete my account</Button>

<Modal bind:showModal>
	<h2 class="h2" slot="header">Confirm deletion?</h2>

	<div class="h-full mt-4">
		<p class="p-4">Are you sure you want to delete your user account?</p>

		<div class="inline-flex h-full justify-between p-4 w-full pt-8">
			<Button classes="error" on:click={onDeleteClick}>Yes, delete</Button>
			<Button variant="secondary" on:click={() => (showModal = false)}>No, go back!</Button>
		</div>
	</div>
</Modal>
