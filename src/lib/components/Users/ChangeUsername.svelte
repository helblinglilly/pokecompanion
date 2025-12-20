<script lang="ts">
	import { currentUser } from '$lib/stores/user';
	import { goto } from '$app/navigation';
	import { Logger } from '$/debt/log';
	import Icon from '$/ui/atoms/icon/Icon.svelte';
	import Button from '$/ui/atoms/button';
	import Modal from '$/ui/molecules/Modal/Modal.svelte';
	import { addNotification } from '$/lib/stores/notifications';
	import { PUBLIC_API_HOST } from '$env/static/public';

	interface Props {
		existingUsername: string;
	}

	let { existingUsername }: Props = $props();

	let newUsername = $state('');
	let statusMessages: string[] = $state([]);

	let showModal = $state(false);

	function validateUsername(username: string) {
		let valid = true;
		let issues = [];
		if (username.length < 4) {
			issues.push('Must be at least 4 characters long');
			valid = false;
		}
		if (!/^[a-z0-9_-]+$/.test(username)) {
			issues.push('Username must only contain alphanumeric lowercase characters, "-" or "_"');
			valid = false;
		}

		if (valid) {
			issues = ['Username is valid'];
		}
		statusMessages = issues;
		return valid;
	}

	const updateUsername = async () => {
		if (!$currentUser) {
			return;
		}

		statusMessages = ['Loading...'];

		if (!validateUsername(newUsername)){
		  throw new Error('Username is not valid');
		}

		try {
			const response = await fetch(`${PUBLIC_API_HOST}/user/${$currentUser.id}`, {
				method: 'PATCH',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: newUsername
				})
			});
			if (response.status > 401) {
				await Logger.error(
					Logger.ErrorClasses.UserOperation,
					new Error('Failed to update username'),
					{
						context: 'Failed to update username',
						user: $currentUser?.id,
						newUsername,
						statusCode: response.status
					}
				);
			}
			return response.ok;
		} catch (error) {
			return false;
		}
	};
</script>

{#if $currentUser}
	<Button
		variant="default"
		classes="gap-4 w-full inline-flex gap-4 justify-center"
		onclick={() => {
			showModal = true;
		}}
	>
		{existingUsername}
		<Icon name="pencil" />
	</Button>
{/if}

<Modal bind:showModal>
	{#snippet header()}
		<h2 class="h2">Update username</h2>
	{/snippet}

	<div class="grid gap-4 p-8">
		<div>
			{#each statusMessages as statusMessage}
				<p>{statusMessage}</p>
			{/each}
		</div>

		<input
			type="text"
			style="width: 100%;"
			bind:value={newUsername}
			placeholder={existingUsername}
			minlength="4"
		/>

		<Button
			variant="accent"
			onclick={async () => {
				const result = await updateUsername();
				showModal = false;

				if (!result) {
					addNotification({
						level: 'failure',
						message: 'Failed to update your username, please try again'
					});
					return;
				}

				if ($currentUser) {
					$currentUser.username = newUsername;
				}
				goto(`/user/${newUsername}`);
			}}>Update</Button
		>
	</div>
</Modal>
