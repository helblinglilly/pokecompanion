<script>
	import { Logger } from '$lib/log';
	import { pb } from '$lib/stores/domain';
	import { addNotification } from '$lib/stores/notifications';
	import { currentUser } from '$lib/stores/user';
</script>

{#if !$currentUser}
	<p>Not signed in</p>
{:else if !$currentUser.verified}
	<p>{$currentUser.email} is not verified</p>
	<button
		class="button secondary"
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
		}}>Request verification email</button
	>
{:else}
	<p>{$currentUser.email} is verified</p>
{/if}
