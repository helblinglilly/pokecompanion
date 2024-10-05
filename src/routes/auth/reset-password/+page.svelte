<script>
	import Button from '$/ui/atoms/button';
	import { pb } from '$lib/stores/domain';

	let email = '';
	let emailError = '';

	const onResetClick = async () => {
		if (!email.includes('@') || !email.includes('.')) {
			emailError = 'Invalid Email';
			return;
		}

		try {
			await $pb.collection('users').requestPasswordReset(email);
		} catch (err) {
			// do nothing - hide if the account doesn't exist
		} finally {
			emailError = 'If this Email address exists, an Email has been sent.';
		}
	};
</script>

<h1 class="h1">Account recovery</h1>

<div class="columns">
	<div class="column">
		<div class="card">
			<h2 class="h2">Social recovery</h2>
			<p>
				If you have a <b>Google</b> or <b>GitHub</b> account with the same Email address:
			</p>
			<p>
				Sign in with either and you will be able to change your password from the user account
				section.
			</p>
			<p>
				Even if you haven't used them here before, they will be associaed with your existing
				account.
			</p>
		</div>
	</div>
</div>

<div class="columns">
	<div class="column">
		<div class="card">
			<h2 class="h2">Reset password</h2>

			<div class="inline-flex">
				<input type="text" placeholder="Email" bind:value={email} />
				<Button
					style="border-radius-bottom-left: 0;"
					on:click={() => {
						onResetClick();
					}}>Reset</Button
				>
			</div>

			<p>{emailError}&nbsp;</p>
		</div>
	</div>
</div>
