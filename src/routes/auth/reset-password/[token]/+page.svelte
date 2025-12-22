<script lang="ts">
	import { page } from '$app/state';
	import { PUBLIC_API_HOST } from '$env/static/public';
	import { Logger } from '$/debt/log';
	import { addNotification } from '$/features/notifications/notifications';
	import { isPasswordValid } from '$/debt/user-client';

	let newPassword = $state('');
	let confirmNewPassword = $state('');
	let passwordError = $state('');
	let token = page.params.token;

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
			await fetch(`${PUBLIC_API_HOST}/auth/password-reset`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					token: token,
					newPassword: newPassword,
					confirmNewPassword: confirmNewPassword
				}),
				credentials: 'include'
			});
			passwordError = 'Your password has been changed';
			await Logger.addPageAction('PasswordReset');
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
				onclick={onUpdateClick}
			>
				Change Password
			</button>
		</div>
	</div>
</div>
