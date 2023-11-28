<script>
	import InlineTextButton from '$components/InlineTextButton.svelte';
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

<h1>Account recovery</h1>

<div class="columns">
	<div class="column">
		<div class="card">
			<h2>Social recovery</h2>
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
			<h2>Reset password</h2>
			<InlineTextButton
				buttonConfig={{ text: 'Reset', onClick: onResetClick, class: 'secondary' }}
				inputConfig={{ placeholder: 'Email' }}
				variation="small"
				bind:valueBinding={email}
				containerStyling="max-width: 600px;"
			/>
			<p>{emailError}&nbsp;</p>
		</div>
	</div>
</div>
