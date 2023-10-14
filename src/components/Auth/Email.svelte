<script lang="ts">
	import { goto } from '$app/navigation';
	import { notifications } from '$lib/stores/notifications';

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

		const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
		if (!passwordPattern.test(password)) {
			passwordError =
				'Must contain: 1 uppercase, 1 lowercase, 1 number, 1 special char and be 8+ characters long';
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
				notifications.set([
					{
						message: 'Account created. You can now log in',
						level: 'failure',
						visible: true
					},
					...$notifications
				]);

				mode = 'login';
			} else {
				const body = await response.json();
				let { data } = body;
				data = JSON.parse(data);
				goto(`/user/${data[0]}`);
			}
		} catch {
			if (mode === 'login') {
				passwordError = 'Login failed';
			} else {
				usernameError = 'Sign up failed';
			}
			notifications.set([
				{
					message: errorMessage,
					level: 'failure',
					visible: true
				},
				...$notifications
			]);
		}
	};
</script>

<form class="card" method="POST" on:submit={handleFormSubmit}>
	<div class="columns">
		<label for="email">Email</label>
		<input type="email" id="email" bind:value={email} />
		<p>{emailError}&nbsp;</p>
	</div>
	<div class="columns" style="margin-top: 12px;">
		<label for="password">Password</label>
		<input type="password" id="password" bind:value={password} />
		<p>{passwordError}&nbsp;</p>
	</div>

	<div class="columns" style={`margin-top: 12px; ${mode === 'login' ? 'display: none;' : ''}`}>
		<label for="passwordConfirm">Confirm Password</label>
		<input type="password" id="passwordConfirm" bind:value={passwordConfirm} />
		<p>{passwordConfirmError}&nbsp;</p>
	</div>

	<div class="columns" style={`margin-top: 12px; ${mode === 'login' ? 'display: none;' : ''}`}>
		<label for="username">Username <i>(Optional)</i></label>
		<input type="text" id="username" bind:value={username} />
		<p>{usernameError}&nbsp;</p>
	</div>

	<div class="columns mobile">
		<div class="column" style="width: 100%;">
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
		<div class="column" style="width: 100%;">
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
</form>
