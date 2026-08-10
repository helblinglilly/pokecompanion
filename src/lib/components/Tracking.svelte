<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import posthog from 'posthog-js';
	import { PUBLIC_ENVIRONMENT, PUBLIC_POSTHOG_KEY } from '$env/static/public';
	import { tracker } from '$lib/analytics/tracker';
	import {
		animateSprites,
		primaryLanguage,
		secondaryLanguage,
		selectedGame,
		theme,
		versionSpecificPokemonSprites,
		versionSpecificTypeSprites
	} from '$lib/stores/domain';
	import { currentUser } from '$lib/stores/user';
	import { get } from 'svelte/store';

	const POSTHOG_API_HOST = 'https://pog.pokecompanion.com';
	let isPostHogTracking = false;

	afterNavigate(() => {
		if (isPostHogTracking) {
			posthog.capture('$pageview');
		}
	});

	onMount(() => {
		if (PUBLIC_ENVIRONMENT !== 'production' || !PUBLIC_POSTHOG_KEY) {
			return;
		}

		posthog.init(PUBLIC_POSTHOG_KEY, {
			api_host: POSTHOG_API_HOST,
			capture_pageview: false
		});
		window.posthog = posthog;
		isPostHogTracking = true;
		posthog.capture('$pageview');

		const setSettings = () => {
			tracker.setPersonProperties({
				language: get(primaryLanguage),
				secondaryLanguage: get(secondaryLanguage) || undefined,
				game: get(selectedGame),
				animateSprites: get(animateSprites),
				versionSpecificPokemonSprites: get(versionSpecificPokemonSprites),
				versionSpecificTypeSprites: get(versionSpecificTypeSprites),
				theme: get(theme)
			});
		};

		const unsubscribers = [
			currentUser.subscribe((user) => user && tracker.identifyUser(user)),
			primaryLanguage.subscribe(setSettings),
			secondaryLanguage.subscribe(setSettings),
			selectedGame.subscribe(setSettings),
			animateSprites.subscribe(setSettings),
			versionSpecificPokemonSprites.subscribe(setSettings),
			versionSpecificTypeSprites.subscribe(setSettings),
			theme.subscribe(setSettings)
		];

		return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
	});
</script>

<svelte:head>
	{#if PUBLIC_ENVIRONMENT === 'production'}
		<script
			defer
			src="https://analytics.helbling.uk/script.js"
			data-website-id="f303cb13-d1aa-42c0-ab5b-77937e5a1daa"
			data-domains="pokecompanion.com,www.pokecompanion.com"
			data-do-not-track="true"
			data-performance="true"
		></script>
	{/if}
</svelte:head>
