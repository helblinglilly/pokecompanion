<script lang="ts">
	import { goto } from '$app/navigation';
	import { homepageMessaging, pb } from '$lib/stores/domain';
	import { addNotification, notifications } from '$lib/stores/notifications';
	import { currentUser, type SignedInUser } from '$lib/stores/user';
	import { deleteCookie, getCookie, getRawCookie } from '$lib/utils/cookies';
	import { isPasswordValid } from '$lib/utils/user-client';

	let mode: 'login' | 'signup' = 'login';
	let email: string;
	let password: string;
	let passwordConfirm: string;
	let username: string;

	let emailError: string = '';
	let passwordError: string = '';
	let passwordConfirmError: string = '';
	let usernameError: string = '';

	let isSubmitting = false;

	const handleFormSubmit = async (e: Event) => {
		e.preventDefault();

		let hasFormError = false;

		if (!email.includes('@') || !email.includes('.')) {
			emailError = 'Invalid Email';
			hasFormError = true;
		}

		const passwordResult = isPasswordValid(password);
		if (passwordResult.valid === false) {
			passwordError = passwordResult.feedback;
			hasFormError = true;
		}

		if (mode === 'signup' && password !== passwordConfirm) {
			passwordConfirmError = 'Passwords do not match';
			hasFormError = true;
		}

		if (hasFormError) {
			return;
		}

		let errorMessage = mode === 'login' ? 'Login failed' : 'Sign up failed';

		try {
			const formData = new FormData();
			formData.append('email', email);
			formData.append('password', password);
			formData.append('passwordConfirm', passwordConfirm);
			if (username) {
				formData.append('username', username);
			}

			isSubmitting = true;

			const response = await fetch(`/auth?/${mode}`, {
				method: 'POST',
				body: formData
			});

			isSubmitting = false;

			if (response.status !== 200) {
				throw response.status;
			}

			if (mode === 'signup') {
				addNotification({ message: 'Account created. You can now sign in', level: 'success' });

				mode = 'login';
			} else {
				// Auth cookie is set as part of form action response
				$pb.authStore.loadFromCookie(getRawCookie(document.cookie, 'pb_auth') || '');
				currentUser.set($pb.authStore.model as SignedInUser);

				homepageMessaging.set('returning-user');

				const redirectUrl = getCookie('auth-redirect');
				if (redirectUrl) {
					deleteCookie('auth-redirect');
					goto(redirectUrl);
					return;
				}
				goto('/');
			}
		} catch {
			if (mode === 'login') {
				passwordError = 'Login failed';
			} else {
				usernameError = 'Sign up failed';
			}

			addNotification({ message: 'Oh oh, that was our fault. Please try again', level: 'failure' });
		}
	};
</script>

<form class="card" method="POST" on:submit={handleFormSubmit}>
	<div id="wrapper">
		<div class="columns inputGroup">
			<label for="email">Email</label>
			<input
				type="email"
				id="email"
				bind:value={email}
				on:change={() => {
					if (!email) {
						emailError = '';
					}
				}}
			/>
			<p>{emailError}&nbsp;</p>
		</div>
		<div class="columns inputGroup" style="margin-top: 12px;">
			<label for="password">Password</label>
			<input type="password" id="password" bind:value={password} />
			<p>{passwordError}&nbsp;</p>
		</div>

		<div
			class="columns inputGroup"
			style={`margin-top: 12px; ${mode === 'login' ? 'display: none;' : ''}`}
		>
			<label for="passwordConfirm">Confirm Password</label>
			<input type="password" id="passwordConfirm" bind:value={passwordConfirm} />
			<p>{passwordConfirmError}&nbsp;</p>
		</div>

		<div
			class="columns inputGroup"
			style={`margin-top: 12px;${mode === 'login' ? 'display: none;' : ''}`}
		>
			<label for="username">Username <i>(Optional)</i></label>
			<input
				type="text"
				id="username"
				bind:value={username}
				on:change={() => {
					if (!username) {
						usernameError = '';
					}
				}}
			/>
			<p>{usernameError}&nbsp;</p>
		</div>

		<div class="columns mobile">
			<div class="column" style="width: 100%; padding-left: 0;">
				<button
					class="button secondary"
					style="width: 100%"
					on:click={(e) => {
						if (mode === 'signup') {
							e.preventDefault();
							mode = 'login';
						}
					}}
				>
					{`${mode === 'login' && isSubmitting ? 'Loading...' : 'Log in'}`}
				</button>
			</div>
			<div class="column" style="width: 100%; padding-right: 0;">
				<button
					class="button secondary"
					style="width: 100%"
					on:click={(e) => {
						if (mode === 'login') {
							e.preventDefault();
							mode = 'signup';
						}
					}}>{`${mode === 'signup' && isSubmitting ? 'Loading...' : 'Sign up'}`}</button
				>
			</div>
		</div>
		<a href="/auth/reset-password">I forgot my password</a>
	</div>
</form>

<style>
	input {
		width: 100%;
	}

	@media (max-width: 768px) {
		.columns {
			width: 100%;
		}

		.inputGroup {
			width: 100%;
		}
	}

	@media (min-width: 768px) {
		.inputGroup {
			margin-left: auto;
			margin-right: auto;
			width: 30vw;
		}

		form.card {
			max-width: 50%;
		}
	}

	#wrapper {
		width: 40%;
		display: grid;
		justify-content: center;
		width: 100%;
	}
</style>
