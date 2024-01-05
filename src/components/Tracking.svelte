<script lang="ts">
	import { navigating } from '$app/stores';
	import { logToAxiom } from '$lib/log';
	import { onMount } from 'svelte';
	import * as Sentry from '@sentry/browser';
	import { PUBLIC_SENTRY_DSN } from '$env/static/public';
	import { removeLastCharIfExists } from '$lib/utils/string';
	import { homepageMessaging } from '$lib/stores/domain';

	let navsAsNewUser = 0;
	navigating.subscribe(async (nav) => {
		if (nav) {
			await nav.complete;
			logToAxiom({
				action: 'pageview',
				referrer: {
					url: nav.from?.url.href,
					navSource: 'internal'
				},
				url: {
					host: nav.to?.url.host,
					hostname: nav.to?.url.hostname,
					href: nav.to?.url.href,
					pathname:
						nav.to?.url.pathname !== '/'
							? removeLastCharIfExists(nav.to?.url.pathname ?? 'no data', '/')
							: '/',
					search: nav.to?.url.search,
					hash: nav.to?.url.hash
				}
			});

			if ($homepageMessaging === 'new-user') {
				navsAsNewUser += 1;

				if (navsAsNewUser > 20) {
					homepageMessaging.set('returning-user');
				}
			}
		}
	});

	onMount(() => {
		logToAxiom({
			action: 'pageview',
			referrer: {
				url: document.referrer,
				navSource: 'external'
			}
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
