<script lang="ts">
	import { addNotification } from '$/features/notifications/notifications';
	import Button from '$/ui/atoms/Button.svelte';
	import { PUBLIC_API_HOST } from '$env/static/public';

	let email = $state('');

	const onSubmit = async () => {
		const res = await fetch(`${PUBLIC_API_HOST}/app/invite`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: email,
				service: 'google'
			})
		});

		if (!res.ok) {
			addNotification({ message: 'Sorry, please try that again', level: 'failure' });
			return;
		}
		addNotification({ message: 'Thanks, well be in touch soon!', level: 'success' });
		email = '';
	};
</script>

<div class="justify-center grid gap-8">
	<h1 class="h1">Register your interest in the Pokécompanion App!</h1>

	<h2 class="h2">We are actively looking for testers on Android/Google Play</h2>

	<form onsubmit={onSubmit} class="grid gap-4">
		<p>Use the form below to sign up as a beta tester. You should receive an invite within 72h.</p>
		<textarea maxlength="64" bind:value={email} placeholder={'test@example.com'}></textarea>

		<Button variant="accent" type="submit">Register</Button>
	</form>

	<p>Please note that invitations are currently restricted to the UK, Germany and Switzerland</p>

	<section>
		<p>
			Already registered and looking for the listing? <a
				href="https://play.google.com/apps/internaltest/4700997723645376854">Click here</a
			>
		</p>
	</section>
</div>

<style>
	textarea {
		background-color: white;
	}
</style>
