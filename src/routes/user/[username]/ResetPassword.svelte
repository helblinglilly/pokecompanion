<script lang="ts">
	import { Logger } from '$/lib/log';
	import { pb } from '$/lib/stores/domain';
	import { addNotification } from '$/lib/stores/notifications';
	import { currentUser } from '$/lib/stores/user';
	import Button from '$/ui/atoms/button/Button.svelte';
</script>

<Button
	variant="primary"
	on:click={async () => {
		if (!$currentUser) {
			return;
		}
		try {
			await $pb.collection('users').requestPasswordReset($currentUser.email);
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
