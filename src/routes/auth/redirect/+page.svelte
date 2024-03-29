<script lang="ts">
	import { deleteCookie, getCookie, parseCookieString, setCookie } from '$lib/utils/cookies';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { IAuthProvider } from '../signin/+page';
	import { addMinutesToDate } from '$lib/utils/date';
	import { currentUser, type SignedInUser } from '$lib/stores/user';
	import { homepageMessaging, pb } from '$lib/stores/domain';
	import { Logger } from '$lib/log';

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
			const authData = await $pb
				.collection('users')
				.authWithOAuth2Code(
					provider.name,
					params.get('code') ?? '',
					provider.codeVerifier,
					`${window.location.protocol}//${window.location.hostname}${
						window.location.port ? ':' + window.location.port : ''
					}/auth/redirect`
				);

			let isNewUser = false;

			if ((authData.meta && authData.meta.isNew) || !authData.record.avatar) {
				const svgResponse = await fetch(`https://avatar.helbling.uk/${authData.record.username}`);
				const svgImage = await svgResponse.blob();

				try {
					await $pb.collection('users').update(authData.record.id, { avatar: svgImage });
				} catch (err) {
					await Logger.warn('Failed to set a profile picture for a new user', {
						error: Logger.buildError(err).message,
						user: authData.record.id
					});
				}
				isNewUser = true;
			}

			await Logger.addPageAction('User', isNewUser ? 'OAuthSignUp' : 'OAuthSignIn', {
				provider: provider.name,
				user: authData.record.id
			});

			const redirectUrl = getCookie('auth-redirect');
			const cookie = $pb.authStore.exportToCookie({ expires: addMinutesToDate(new Date(), 30) });

			const cookieValues = parseCookieString(cookie);
			const pbAuthObj = JSON.parse(cookieValues.pb_auth);

			currentUser.set($pb.authStore.model as SignedInUser);
			setCookie('pb_auth', JSON.stringify(pbAuthObj), {
				expires: new Date(cookieValues.Expires),
				path: '/'
			});

			if (isNewUser) {
				homepageMessaging.set('new-user');
				goto(`/`);
				return;
			} else {
				homepageMessaging.set('returning-user');
			}

			if (redirectUrl) {
				deleteCookie('auth-redirect');
				goto(redirectUrl);
				return;
			}

			goto(`/`);
		} catch (err) {
			status = 'Sign in failed';
			errorDetails = 'Could not sign you in. Please try again.';

			await Logger.error(Logger.ErrorClasses.UserOperation, Logger.buildError(err), {
				context: 'OAuth Sign In failed'
			});
		}
	});
</script>

<div class="columns">
	<div class="column centered">
		<div>
			<h2 class="h2">{status}</h2>
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
