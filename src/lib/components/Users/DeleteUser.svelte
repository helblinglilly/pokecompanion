<script lang="ts">
	import { goto } from '$app/navigation';
	import { Logger } from '$lib/log';
	import { pb } from '$lib/stores/domain';
	import { addNotification } from '$lib/stores/notifications';
	import { currentUser } from '$lib/stores/user';
	import { deleteCookie } from '$lib/utils/cookies';
	import Button from '$/ui/atoms/button/Button.svelte';
	import Modal from '$/ui/molecules/Modal/Modal.svelte';
	import type { RecordModel } from 'pocketbase';

	let showModal = false;
	export let user: RecordModel;

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
