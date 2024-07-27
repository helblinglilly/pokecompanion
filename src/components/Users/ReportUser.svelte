<script lang="ts">
	import Button from '$/ui/atoms/button/Button.svelte';
	import Modal from '$/ui/molecules/Modal/Modal.svelte';
	import { Logger } from '$lib/log';
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
			await Logger.error(Logger.ErrorClasses.UserOperation, Logger.buildError(err), {
				context: 'Failed to report user',
				reporter: $currentUser?.id,
				reportee: username
			});
		}
	};
</script>

{#if $currentUser}
	<Button classes="w-full" variant="secondary" on:click={() => (showModal = true)}>Report</Button>
{/if}

<Modal bind:showModal classes="md:h-[20rem]">
	<h2 class="h2" slot="header">Report {username}</h2>

	<div class="grid gap-4 p-8 md:min-w-[40rem]">
		<div>
			<p>Optional - Add details</p>
		</div>
		<form
			class="grid gap-4"
			on:submit={async () => {
				await reportUserClick();
				submitButtonText = 'Submit';
				reportText = '';
				showModal = false;
			}}
		>
			<input type="text" bind:value={reportText} placeholder="What's wrong?" />
			<Button variant="accent" classes="w-full">{submitButtonText}</Button>
		</form>
	</div>
</Modal>
