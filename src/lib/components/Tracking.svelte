<script lang="ts">
	import {
		PUBLIC_ENVIRONMENT,
		PUBLIC_POSTHOG_KEY,
		PUBLIC_POSTHOG_PREVIEW
	} from '$app/env/public';
	import { afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import posthog from 'posthog-js';

	onMount(() => {
		const isPreview = PUBLIC_ENVIRONMENT === 'preview' && PUBLIC_POSTHOG_PREVIEW === 'true';
		if (!PUBLIC_POSTHOG_KEY || (PUBLIC_ENVIRONMENT !== 'production' && !isPreview)) return;

		posthog.init(PUBLIC_POSTHOG_KEY, {
			api_host: 'https://pog.pokecompanion.com',
			ui_host: 'https://eu.posthog.com',
			person_profiles: 'identified_only',
			// SvelteKit navigation is tracked explicitly below.
			capture_pageview: false
		});
		posthog.register({ deployment_environment: PUBLIC_ENVIRONMENT });
		window.posthog = posthog;
		posthog.capture('$pageview');
	});

	afterNavigate(({ from }) => {
		if (from) window.posthog?.capture('$pageview');
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
