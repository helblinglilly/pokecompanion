<script lang="ts">
	import { deleteCookie, getCookie } from '$lib/utils/cookies';
	import { onMount } from 'svelte';
	import type { IAuthProvider } from '../../user/+page';
	import { pb } from '$lib/pocketbase';
	import { goto } from '$app/navigation';

	let status = 'Authenticating...';
	let errorDetails = '';

	onMount(async () => {
		const providerCookie = getCookie('provider');
		deleteCookie('provider');

		if (!providerCookie) {
			status = 'Authentication Error';
			errorDetails =
				'Could not retrieve data that OAuth request was initiated with. Please try again';
			return;
		}
		const provider = JSON.parse(providerCookie) as IAuthProvider;
		const params = new URL(window.location.toString()).searchParams;

		if (provider.state && params.get('state')) {
			if (provider.state !== params.get('state')) {
				status = 'Authentication Error';
				errorDetails = "State parameters didn't match. Please try again";
				return;
			}
		}

		status = 'Signin in...';

		try {
			await pb
				.collection('users')
				.authWithOAuth2Code(
					provider.name,
					params.get('code') ?? '',
					provider.codeVerifier,
					'http://localhost:5173/auth/redirect'
				);
			goto('/user');
		} catch (err) {
			console.error(err);
			status = 'Sign in failed';
			errorDetails = 'Could not sign you in. Please try again;';
		}
	});
</script>

<div class="columns">
	<div class="column centered">
		<div>
			<h2>{status}</h2>
		</div>
	</div>
</div>

{#if errorDetails}
	<div class="columns">
		<div class="column centered">
			<p>{errorDetails}</p>
		</div>
	</div>
{/if}
