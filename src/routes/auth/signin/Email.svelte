<script lang="ts">
	import Button from '$/ui/atoms/Button.svelte';
	import Card from '$/ui/atoms/Card.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { PUBLIC_API_HOST } from '$env/static/public';
	import { addNotification } from '$/features/notifications/notifications';

	let email = $state('');
	let password = $state('');
	let passwordConfirm = $state('');
	let username = $state('');

	let emailError = $state('');
	let passwordError = $state('');
	let passwordConfirmError = '';
	let usernameError = $state('');
	let signupError = $state('');

	let showSignupFields = $state(false);
	let showPassword = $state(false);

	const handleFormSubmit = async () => {
		if (showSignupFields) {
			if (!email) {
				emailError = 'Email cannot be empty';
				return;
			}
			if (!password) {
				passwordError = 'Password cannot be empty';
				return;
			}

			if (password !== passwordConfirm) {
				passwordError = 'Passwords do not match';
				return;
			}

			signupError = '';

			const res = await fetch(`${PUBLIC_API_HOST}/auth/signup`, {
				credentials: 'include',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: email,
					password: password,
					password_confirmation: passwordConfirm,
					username: username
				})
			});

			if (res.status !== 200) {
				try {
					const body = await res.json();
					signupError = body?.message ?? 'Something went wrong, please try again';
				} catch {
					signupError = 'Something went wrong, please try again';
				}
				return;
			}

			addNotification({ message: 'Account created. You can now sign in', level: 'success' });

			signupError = '';
			showSignupFields = false;
			return;
		}

		if (!email) {
			emailError = 'Email cannot be empty';
			return;
		}
		if (!password) {
			passwordError = 'Password cannot be empty';
			return;
		}

		const res = await fetch(`${PUBLIC_API_HOST}/auth/login`, {
			credentials: 'include',
			method: 'POST',
			redirect: 'manual',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: email,
				password: password
			})
		});

		switch (res.status) {
			case 200:
				await invalidateAll();
				const body = await res.json();
				if (body.redirectTo) {
					goto(body.redirectTo);
					break;
				}
				goto('/');
				break;
			case 401:
				addNotification({
					level: 'failure',
					message: 'Wrong credentials'
				});
				break;
			case 400:
				addNotification({
					level: 'failure',
					message: 'Bad request'
				});
				break;
			default:
				addNotification({
					level: 'failure',
					message: 'Something went wrong - try a different authentication method'
				});
				break;
		}
	};
</script>

<form onsubmit={handleFormSubmit}>
	<Card>
		<div id="wrapper">
			<div class="columns inputGroup">
				<label for="email">Email</label>
				<input
					type="email"
					id="email"
					bind:value={email}
					onchange={() => {
						if (!email) {
							emailError = '';
						}
					}}
				/>
				<p>{emailError}&nbsp;</p>
			</div>

			<div class="columns inputGroup" style="margin-top: 12px;">
				<label for="password">Password</label>
				<div class="passwordInput">
					<input type={showPassword ? 'text' : 'password'} id="password" bind:value={password} />
					<button
						class="showPasswordButton"
						type="button"
						aria-pressed={showPassword}
						aria-label={showPassword ? 'Hide password' : 'Show password'}
						title={showPassword ? 'Hide password' : 'Show password'}
						onclick={() => (showPassword = !showPassword)}
					>
						{#if showPassword}
							<svg viewBox="0 0 24 24" aria-hidden="true">
								<path d="m3 3 18 18" />
								<path
									d="M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 4.2A10.8 10.8 0 0 1 12 4c5.5 0 9 6 9 6a17.6 17.6 0 0 1-2.1 2.8M6.6 6.6C4.4 8 3 10 3 10s3.5 6 9 6a9.8 9.8 0 0 0 3.4-.6"
								/>
							</svg>
						{:else}
							<svg viewBox="0 0 24 24" aria-hidden="true">
								<path d="M3 10s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" />
								<circle cx="12" cy="10" r="2.5" />
							</svg>
						{/if}
					</button>
				</div>
				<p>{passwordError}&nbsp;</p>
			</div>

			{#if showSignupFields}
				<div class="columns inputGroup" style={`margin-top: 12px;`}>
					<label for="passwordConfirm">Confirm Password</label>
					<input
						type={showPassword ? 'text' : 'password'}
						id="passwordConfirm"
						bind:value={passwordConfirm}
					/>
					<p>{passwordConfirmError}&nbsp;</p>
				</div>

				<div class="columns inputGroup" style={`margin-top: 12px;`}>
					<label for="username">Username <i>(Optional)</i></label>
					<input
						type="text"
						id="username"
						bind:value={username}
						onchange={() => {
							if (!username) {
								usernameError = '';
							}
						}}
					/>
					<p>{usernameError}&nbsp;</p>
				</div>
			{/if}

			{#if signupError}
				<p class="text-error">{signupError}</p>
			{/if}

			<div class="inline-flex justify-between gap-4">
				<div class="column" style="width: 100%; padding-left: 0;">
					<Button classes="w-full" type="submit">Log in</Button>
				</div>
				<div class="column" style="width: 100%; padding-right: 0;">
					<Button
						classes="w-full"
						type={showSignupFields ? 'submit' : 'button'}
						onclick={(e) => {
							if (!showSignupFields) {
								e.preventDefault();
								showSignupFields = true;
							}
						}}>Sign up</Button
					>
				</div>
			</div>
			<a href="/auth/reset-password" class="pt-2">I forgot my password</a>
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

	.text-error {
		color: var(--error);
		margin-top: 4px;
	}

	input {
		background-color: white;
	}

	.passwordInput {
		position: relative;
		width: 100%;
		max-width: 400px;
	}

	.passwordInput input {
		padding-right: 42px;
	}

	.showPasswordButton {
		position: absolute;
		top: 50%;
		right: 8px;
		transform: translateY(-50%);
		border: 0;
		width: 28px;
		height: 28px;
		display: grid;
		place-items: center;
		padding: 3px;
		background: transparent;
		color: #2b2a2a;
		font: inherit;
		cursor: pointer;
	}

	.showPasswordButton svg {
		width: 22px;
		height: 22px;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.showPasswordButton:hover {
		color: var(--red-accent);
	}

	.showPasswordButton:focus-visible {
		outline: 2px solid var(--red-accent);
		outline-offset: 1px;
		border-radius: 4px;
	}
</style>
