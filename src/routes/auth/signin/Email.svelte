<script lang="ts">
	import Button from '$/ui/atoms/button/Button.svelte';
	import Card from '$/ui/atoms/card/Card.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { PUBLIC_API_HOST } from '$env/static/public';
	import { addNotification } from '$lib/stores/notifications';

	let email: string;
	let password: string;
	let passwordConfirm: string;
	let username: string;

	let emailError = '';
	let passwordError = '';
	let passwordConfirmError = '';
	let usernameError = '';

	let showSignupFields = false;

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
				return;
			}

			addNotification({ message: 'Account created. You can now sign in', level: 'success' });

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
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: email,
				password: password
			})
		});

		if (res.status !== 200) {
			return;
		}

		await invalidateAll();
		goto('/');
	};
</script>

<form on:submit={handleFormSubmit}>
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

			{#if showSignupFields}
				<div class="columns inputGroup" style={`margin-top: 12px;`}>
					<label for="passwordConfirm">Confirm Password</label>
					<input type="password" id="passwordConfirm" bind:value={passwordConfirm} />
					<p>{passwordConfirmError}&nbsp;</p>
				</div>

				<div class="columns inputGroup" style={`margin-top: 12px;`}>
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
			{/if}

			<div class="inline-flex justify-between gap-4">
				<div class="column" style="width: 100%; padding-left: 0;">
					<Button classes="w-full" type="submit">Log in</Button>
				</div>
				<div class="column" style="width: 100%; padding-right: 0;">
					<Button
						classes="w-full"
						type={showSignupFields ? 'submit' : 'button'}
						on:click={(e) => {
							e.preventDefault();
							if (!showSignupFields) {
								showSignupFields = true;
							}
						}}>Sign up</Button
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
