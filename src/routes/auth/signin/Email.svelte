<script lang="ts">
	import Button from '$/ui/atoms/button/Button.svelte';
	import Card from '$/ui/atoms/card/Card.svelte';
	import { goto } from '$app/navigation';
	import { homepageMessaging, pb } from '$lib/stores/domain';
	import { addNotification } from '$lib/stores/notifications';
	import { currentUser } from '$lib/stores/user';
	import { deleteCookie, getCookie, getRawCookie } from '$lib/utils/cookies';
	import { isPasswordValid } from '$lib/utils/user-client';

	let mode: 'login' | 'signup' = 'login';
	let email: string;
	let password: string;
	let passwordConfirm: string;
	let username: string;

	let emailError = '';
	let passwordError = '';
	let passwordConfirmError = '';
	let usernameError = '';

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

			console.log('status is', response.status);
			if (mode === 'login' && response.status === 400) {
				addNotification({ message: 'Invalid credentials', level: 'failure' });
				return;
			} else if (response.status !== 200) {
				throw response.status;
			}

			if (mode === 'signup') {
				addNotification({ message: 'Account created. You can now sign in', level: 'success' });

				mode = 'login';
			} else {
				// Auth cookie is set as part of form action response
				$pb.authStore.loadFromCookie(getRawCookie(document.cookie, 'pb_auth') || '');
				currentUser.set($pb.authStore.record);

				homepageMessaging.set('returning-user');

				const redirectUrl = getCookie('auth-redirect');
				if (redirectUrl) {
					deleteCookie('auth-redirect');
					goto(redirectUrl);
					return;
				}
				goto('/');
			}
		} catch (err) {
			if (mode === 'login') {
				passwordError = 'Login failed';
			} else {
				usernameError = 'Sign up failed';
			}

			addNotification({ message: 'Oh oh, that was our fault. Please try again', level: 'failure' });

			// await Logger.error(Logger.ErrorClasses.UserOperation, Logger.buildError(err), {
			// 	context: passwordError ? 'Login failed' : 'Sign up failed'
			// });
		}
	};
</script>

<form method="POST" on:submit={handleFormSubmit}>
	<Card>
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

			<div class="inline-flex justify-between gap-4">
				<div class="column" style="width: 100%; padding-left: 0;">
					<Button
						classes="w-full"
						on:click={(e) => {
							if (mode === 'signup') {
								e.preventDefault();
								mode = 'login';
							}
						}}
					>
						{`${mode === 'login' && isSubmitting ? 'Loading...' : 'Log in'}`}
					</Button>
				</div>
				<div class="column" style="width: 100%; padding-right: 0;">
					<Button
						classes="w-full"
						on:click={(e) => {
							if (mode === 'login') {
								e.preventDefault();
								mode = 'signup';
							}
						}}>{`${mode === 'signup' && isSubmitting ? 'Loading...' : 'Sign up'}`}</Button
					>
				</div>
			</div>
			<a href="/auth/reset-password" class="text-textColour pt-2">I forgot my password</a>
		</div></Card
	>
</form>

<style>
	input {
		width: 100%;
		max-width: 400px;
	}

	.inputGroup {
		width: inherit;
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
		}
	}

	#wrapper {
		width: 40%;
		display: grid;
		justify-content: center;
		width: 100%;
	}
</style>
