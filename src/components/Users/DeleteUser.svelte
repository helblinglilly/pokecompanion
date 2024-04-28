<script lang="ts">
	import { goto } from '$app/navigation';
	import Modal from '$/components/UI/Modal.svelte';
	import { Logger } from '$lib/log';
	import { pb } from '$lib/stores/domain';
	import { addNotification } from '$lib/stores/notifications';
	import { currentUser, type SignedInUser } from '$lib/stores/user';
	import { deleteCookie } from '$lib/utils/cookies';

	let showModal = false;
	export let user: SignedInUser;

	const onDeleteClick = async () => {
		try {
			await $pb.collection('users').delete(user.id);
			$pb.authStore.clear();
			currentUser.set(null);
			deleteCookie('pb_auth');
			goto('/');
		} catch (err) {
			await Logger.error(Logger.ErrorClasses.UserOperation, Logger.buildError(err), {
				context: 'Delete user',
				user: user.id
			});
			addNotification({
				message:
					'Failed to delete user account. Please contact pokecompanion@helbling.uk to delete your account.',
				level: 'failure'
			});
		}
	};
</script>

<button class="button error" on:click={() => (showModal = true)}> Delete my account </button>

<Modal bind:showModal>
	<h2 class="h2" slot="header">Confirm deletion?</h2>

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
