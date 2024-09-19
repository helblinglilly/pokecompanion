<script>
	import Button from '$/ui/atoms/button/Button.svelte';
	import { Logger } from '$lib/log';
	import { pb } from '$lib/stores/domain';
	import { addNotification } from '$lib/stores/notifications';
	import { currentUser } from '$lib/stores/user';
</script>

{#if !$currentUser}
	<p>Not signed in</p>
{:else if !$currentUser.verified}
	<p>{$currentUser.email} is not verified</p>
	<Button
		variant="secondary"
		classes="w-full"
		on:click={async () => {
			try {
				if (!$currentUser) {
					return;
				}
				await $pb.collection('users').requestVerification($currentUser.email);
			} catch (err) {
				addNotification({ message: 'Failed to request verification Email', level: 'failure' });
				await Logger.warn('Failed to request verification email', {
					user: $currentUser?.id,
					error: Logger.buildError(err)
				});
			}
		}}
	>
		Request verification email
	</Button>
{:else}
	<p>{$currentUser.email} is verified</p>
{/if}
