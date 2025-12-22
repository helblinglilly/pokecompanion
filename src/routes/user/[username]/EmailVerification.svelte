<script>
	import Button from '$/ui/atoms/Button.svelte';
	import { PUBLIC_API_HOST } from '$env/static/public';
	import { Logger } from '$/debt/log';
	import { addNotification } from '$/features/notifications/notifications';
	import { currentUser } from '$lib/stores/user';
</script>

{#if !$currentUser}
	<p>Not signed in</p>
{:else if !$currentUser.verified}
	<p>{$currentUser.email} is not verified</p>
	<Button
		variant="secondary"
		classes="w-full"
		onclick={async () => {
			try {
				if (!$currentUser) {
					return;
				}
				await fetch(`${PUBLIC_API_HOST}/auth/verify?email=${$currentUser.email}`, {
					credentials: 'include'
				});
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
