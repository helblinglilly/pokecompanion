<script lang="ts">
	import { navigating } from '$app/stores';
	import { onMount } from 'svelte';
	import {
		animateSprites,
		homepageMessaging,
		primaryLanguage,
		rememberToken,
		secondaryLanguage,
		selectedGame,
		versionSpecificPokemonSprites
	} from '$lib/stores/domain';
	import { getCookie } from '$lib/utils/cookies';
	import type { Languages } from '$lib/utils/language';
	import { PUBLIC_ENVIRONMENT, PUBLIC_SENTRY_DSN } from '$env/static/public';
	import * as Sentry from '@sentry/browser';
	import { PokeapiVersionGroups, getGameGroupFromName } from '$lib/data/games';

	let navsAsNewUser = 0;
	navigating.subscribe(async (nav) => {
		if (nav) {
			if ($primaryLanguage !== getCookie('primaryLanguage')) {
				primaryLanguage.set(getCookie('primaryLanguage') as keyof Languages);
			}
			if ($secondaryLanguage !== getCookie('secondaryLanguage')) {
				secondaryLanguage.set(getCookie('secondaryLanguage') as keyof Languages);
			}
			if ($selectedGame !== getCookie('selectedGame')) {
				const cookieValue = getCookie('selectedGame') as
					| PokeapiVersionGroups
					| 'generic'
					| undefined;
				if (cookieValue) {
					selectedGame.set(getGameGroupFromName(cookieValue));
				}
			}

			await nav.complete;

			if ($homepageMessaging === 'new-user') {
				navsAsNewUser += 1;

				if (navsAsNewUser > 20) {
					homepageMessaging.set('returning-user');
				}
			}
		}
	});

	onMount(() => {
		if (!(PUBLIC_ENVIRONMENT === 'local')) {
			Sentry.init({
				dsn: PUBLIC_SENTRY_DSN,
				environment: PUBLIC_ENVIRONMENT ?? 'local',
				integrations: [new Sentry.BrowserTracing()],
				tracesSampleRate: 1.0,
				replaysOnErrorSampleRate: 1.0,
				initialScope: {
					user: {
						id: $rememberToken
					},
					tags: {
						selectedGame: $selectedGame?.pokeapi ?? 'No game set',
						primaryLanguage: $primaryLanguage,
						secondaryLanguage: $secondaryLanguage,
						versionSpecificPokemonSprites: $versionSpecificPokemonSprites,
						animateSprites: $animateSprites
					}
				}
			});
		}

		if (window.newrelic) {
			window.newrelic.setCustomAttribute('environment', PUBLIC_ENVIRONMENT);
		}
	});
</script>

<svelte:head>
	<script src="/newrelic.js"></script>
</svelte:head>
