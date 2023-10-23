<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { currentUser } from '$lib/stores/user';
	import { notifications } from '$lib/stores/notifications';

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

		if ($currentUser) {
			const data = {
				username: newUsername,
				avatar: $currentUser.avatar
			};
			try {
				statusMessage = 'Loading...';
				await pb.collection('users').update($currentUser?.id, data);
				$currentUser.username = newUsername;
				errorMessage = '';
			} catch (error) {
				errorMessage = "Couldn't update username";
			} finally {
				statusMessage = '';
			}
		}
	};
</script>

{#if $currentUser}
	<div style="display: inline-flex; width: 100%;">
		<div style="display: flex;">
			<input
				type="text"
				style="height: 100%; max-width: 140px;"
				placeholder={$currentUser.username}
				bind:value={newUsername}
			/>
			<button
				class="button secondary"
				on:click={onClick}
				type="submit"
				id="updateUsernameButton"
				style="height: 100%;">Update</button
			>
		</div>
	</div>
	{#if errorMessage}
		<p class="error">{errorMessage}</p>
	{/if}
	{#if statusMessage}
		<p class="warning">{statusMessage}</p>
	{/if}
{/if}

<style>
	.error {
		color: var(--error);
	}
	.warning {
		color: var(--warning);
	}
</style>
