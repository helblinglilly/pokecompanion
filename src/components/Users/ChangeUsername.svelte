<script lang="ts">
	import { currentUser } from '$lib/stores/user';
	import { notifications } from '$lib/stores/notifications';
	import InlineTextButton from '$components/InlineTextButton.svelte';
	import { goto } from '$app/navigation';
	import { pb } from '$lib/stores/domain';

	let newUsername: string;
	let errorMessage: string;
	let statusMessage: string;
	const onClick = async () => {
		if (!newUsername) {
			errorMessage = "Can't be empty";
			return;
		}

		if (newUsername.length < 4) {
			errorMessage = 'Must be at least 4 characters long';
			return;
		}
		errorMessage = '';

		if (!$currentUser) {
			return;
		}

		try {
			const repsonse = await fetch('/auth/username', {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${$pb.authStore.token}`
				},
				body: JSON.stringify({
					updatedUsername: newUsername
				})
			});
			if (!repsonse.ok) {
				let message = 'Failed to update username';
				try {
					const body = await repsonse.json();
					message = body;
				} catch (_) {}
				throw new Error(message);
			}
			$currentUser.username = newUsername;
			errorMessage = '';
			goto(`/user/${newUsername}`);
		} catch (error) {
			errorMessage = "Couldn't update username";
		} finally {
			statusMessage = '';
		}
	};
</script>

{#if $currentUser}
	<InlineTextButton
		bind:valueBinding={newUsername}
		variation="regular"
		buttonConfig={{ text: 'Update', onClick: onClick, class: 'secondary' }}
		inputConfig={{
			placeholder: $currentUser.username,
			style: 'max-width: 50%;'
		}}
		containerStyling="justify-content: center"
	/>
	{#if errorMessage}
		<p class="error">{errorMessage}</p>
	{/if}
	{#if statusMessage}
		<p class="warning">{statusMessage}</p>
	{/if}
{/if}
