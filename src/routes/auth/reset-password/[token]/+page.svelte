<script lang="ts">
	import { page } from '$app/stores';
	import { Logger } from '$lib/log';
	import { pb } from '$lib/stores/domain';
	import { addNotification } from '$lib/stores/notifications';
	import { isPasswordValid } from '$lib/utils/user-client';

	let newPassword: string;
	let confirmNewPassword: string;
	let passwordError = '';
	let token = $page.params.token;

	const onUpdateClick = async () => {
		const result = isPasswordValid(newPassword);
		if (!result.valid) {
			passwordError = result.feedback;
			return;
		}

		if (!newPassword || newPassword !== confirmNewPassword) {
			passwordError = "Passwords don't match";
			return;
		}

		if (!token) {
			passwordError = 'Something went wrong';
			return;
		}

		passwordError = '';

		try {
			await $pb.collection('users').confirmPasswordReset(token, newPassword, confirmNewPassword);
			passwordError = 'Your password has been changed';
			await Logger.addPageAction('User', 'PasswordReset');
		} catch (err) {
			addNotification({ message: 'Failed to reset password', level: 'failure' });
			await Logger.warn('User', {
				context: 'PasswordResetFailed',
				error: Logger.buildError(err)
			});
		}
	};
</script>

<div class="columns">
	<div class="column" style="display: grid; justify-content: center;">
		<h2 class="h2">Reset your password</h2>
		<div style="display: grid; gap: 1rem; max-width: 400px;">
			<input type="password" placeholder="New password" bind:value={newPassword} />

			<input type="password" placeholder="Confirm password" bind:value={confirmNewPassword} />

			<p>{passwordError}&nbsp;</p>

			<button
				class="button primary"
				disabled={newPassword !== confirmNewPassword || !newPassword}
				on:click={onUpdateClick}
			>
				Change Password
			</button>
		</div>
	</div>
</div>
