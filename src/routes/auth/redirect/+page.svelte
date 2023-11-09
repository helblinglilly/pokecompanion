<script lang="ts">
	import { deleteCookie, getCookie } from '$lib/utils/cookies';
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';
	import { goto } from '$app/navigation';
	import { oAuthRedirectUrl } from '$lib/stores/domain';
	import type { IAuthProvider } from '../signin/+page';
	import { currentUser } from '$lib/stores/user';

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
			const authData = await pb
				.collection('users')
				.authWithOAuth2Code(
					provider.name,
					params.get('code') ?? '',
					provider.codeVerifier,
					oAuthRedirectUrl
				);

			if ((authData.meta && authData.meta.isNew) || !authData.record.avatar) {
				const svgResponse = await fetch(`/api/generateAvatar?key=${authData.record.username}`);
				const svgImage = await svgResponse.blob();

				await pb.collection('users').update(authData.record.id, { avatar: svgImage });
			}

			const redirectUrl = getCookie('auth-redirect');

			if (redirectUrl) {
				goto(redirectUrl);
				deleteCookie('auth-redirect');
				return;
			}

			if ($currentUser) {
				goto(`/user/${$currentUser.username}`);
				return;
			}
			goto(`/signin`);
		} catch (err) {
			console.error(err);
			status = 'Sign in failed';
			errorDetails = 'Could not sign you in. Please try again.';
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
