<script lang="ts">
	import Button from '$/ui/atoms/button/Button.svelte';
	import Modal from '$/ui/molecules/Modal/Modal.svelte';
	import { PUBLIC_API_HOST } from '$env/static/public';
	import { Logger } from '$lib/log';
	import { addNotification } from '$lib/stores/notifications';
	import { currentUser } from '$lib/stores/user';

	let showModal = false;
	let reportText = '';
	let submitButtonText = 'Submit';
	export let username: string;

	const reportUserClick = async () => {
		try {
			await fetch(`${PUBLIC_API_HOST}/user/report`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: username,
					notes: reportText
				})
			});

			submitButtonText = 'Reporting...';
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
