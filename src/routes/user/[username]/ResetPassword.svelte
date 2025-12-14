<script lang="ts">
	import { Logger } from '$/lib/log';
	import { addNotification } from '$/lib/stores/notifications';
	import { currentUser } from '$/lib/stores/user';
	import Button from '$/ui/atoms/button/Button.svelte';
	import { PUBLIC_API_HOST } from '$env/static/public';
</script>

<Button
	variant="primary"
	on:click={async () => {
		if (!$currentUser) {
			return;
		}
		try {
			await fetch(`${PUBLIC_API_HOST}/auth/password-reset?email=${$currentUser.email}`, {
				credentials: 'include'
			});
			addNotification({
				message: 'You have requested a password reset',
				level: 'info'
			});
		} catch (err) {
			addNotification({
				message: 'Failed to request password reset. Please try again',
				level: 'failure'
			});
			await Logger.error(Logger.ErrorClasses.UserOperation, Logger.buildError(err), {
				context: 'Failed to request password reset'
			});
		}
	}}
>
	Password Reset
</Button>
