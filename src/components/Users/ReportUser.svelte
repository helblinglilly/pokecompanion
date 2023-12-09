<script lang="ts">
	import Modal from '$components/Modal.svelte';
	import { error } from '$lib/log';
	import { getIdByUsername } from '$lib/pb/publicUsers';
	import { pb } from '$lib/stores/domain';
	import { addNotification } from '$lib/stores/notifications';
	import { currentUser } from '$lib/stores/user';

	let showModal = false;
	let reportText = '';
	let submitButtonText = 'Submit';
	export let style: string = '';
	export let username: string;

	const reportUserClick = async () => {
		try {
			submitButtonText = 'Reporting...';
			const userId = await getIdByUsername(username);
			if (!userId) {
				throw new Error(`Could not retrieve user id for "${username}"`);
			}

			await $pb.collection('user_reports').create({
				user: userId,
				notes: reportText,
				status: 'new',
				reported_by: $currentUser?.id ?? null
			});
			addNotification({ message: `Reported ${username}`, level: 'info' });
		} catch (err) {
			addNotification({
				message: `Failed to report ${username}. Please try again`,
				level: 'failure'
			});
			error(
				'Failed to report user',
				'FailedToReportUser',
				`User: ${$currentUser?.id}, Reporting: ${username}, ${JSON.stringify(err)}`
			);
		}
	};
</script>

{#if $currentUser}
	<button class="button secondary" {style} on:click={() => (showModal = true)}> Report </button>
{/if}
<Modal bind:showModal>
	<h2 slot="header">Report {username}</h2>
	<p><i>Optional</i></p>

	<form
		on:submit={async () => {
			await reportUserClick();
			submitButtonText = 'Submit';
			reportText = '';
			showModal = false;
		}}
	>
		<input
			type="text"
			bind:value={reportText}
			id="reportTextInput"
			placeholder="What is wrong with this user?"
		/>
		<button class="button" style="display: block; width: 100%; margin-top: 1rem;"
			>{submitButtonText}</button
		>
	</form>
</Modal>

<style>
	#reportTextInput {
		width: 300px;
	}

	input[type='text'] {
		background-color: var(--secondary);
		color: var(--text);
		border: 1px solid var(--accent);
	}
</style>
