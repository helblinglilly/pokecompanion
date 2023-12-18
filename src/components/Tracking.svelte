<script lang="ts">
	import { navigating, page } from '$app/stores';
	import { logToAxiom } from '$lib/log';
	import { onMount } from 'svelte';
	import * as Sentry from '@sentry/browser';
	import { PUBLIC_SENTRY_DSN } from '$env/static/public';

	navigating.subscribe(async (nav) => {
		if (nav) {
			await nav.complete;
			logToAxiom({
				action: 'pageview',
				referrer: {
					url: nav.from?.url.href,
					navSource: 'internal'
				},
				status: $page.status,
				url: {
					host: nav.to?.url.host,
					href: nav.to?.url.href,
					pathname: nav.to?.url.pathname,
					search: nav.to?.url.search,
					hash: nav.to?.url.hash
				},
				user: $page.data.user?.id,
				error: $page.error
			});
		}
	});

	onMount(() => {
		logToAxiom({
			action: 'pageview',
			referrer: {
				url: document.referrer,
				navSource: 'external'
			},
			status: $page.status,
			url: {
				host: $page.url.host,
				href: $page.url.href,
				pathname: $page.url.pathname,
				search: $page.url.search,
				hash: $page.url.hash
			},
			user: $page.data.user?.id,
			error: $page.error
		});

		Sentry.init({
			dsn: PUBLIC_SENTRY_DSN,
			tracesSampleRate: 1.0,
			replaysSessionSampleRate: 0.1,
			replaysOnErrorSampleRate: 1.0,
			integrations: [
				new Sentry.Replay({
					maskAllText: false
				})
			]
		});
	});
</script>
