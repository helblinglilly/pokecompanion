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
		SettingNames,
		versionSpecificPokemonSprites
	} from '$lib/stores/domain';
	import { getCookie } from '$lib/utils/cookies';
	import type { Languages } from '$lib/utils/language';
	import { PUBLIC_ENVIRONMENT, PUBLIC_SENTRY_DSN } from '$env/static/public';
	import * as Sentry from '@sentry/browser';
	import { getGameGroupFromName } from '$lib/data/games';
	import type { PokeapiVersionGroups } from '$/@types/api.pokecompanion';

	let navsAsNewUser = 0;
	navigating.subscribe(async (nav) => {
		if (nav) {
			if ($primaryLanguage !== getCookie(SettingNames.PrimaryLanguage)) {
				primaryLanguage.set(getCookie(SettingNames.PrimaryLanguage) as keyof Languages);
			}
			if ($secondaryLanguage !== getCookie(SettingNames.SecondaryLanguage)) {
				secondaryLanguage.set(getCookie(SettingNames.SecondaryLanguage) as keyof Languages);
			}
			if ($selectedGame !== getCookie(SettingNames.SelectedGame)) {
				const cookieValue = getCookie(SettingNames.SelectedGame) as
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
