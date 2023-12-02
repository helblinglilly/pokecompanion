import { Replay } from '@sentry/svelte';
import * as Sentry from '@sentry/svelte';
/* https://github.com/getsentry/sentry-javascript/issues/8291 */
// import { Replay } from '@sentry/sveltekit';
// import * as Sentry from '@sentry/sveltekit';
import { PUBLIC_SENTRY_DSN } from '$env/static/public';
import type { HandleClientError } from '@sveltejs/kit';

try {
	Sentry.init({
		dsn: PUBLIC_SENTRY_DSN,
		tracesSampleRate: 1.0,

		// This sets the sample rate to be 10%. You may want this to be 100% while
		// in development and sample at a lower rate in production
		replaysSessionSampleRate: 0.1,

		// If the entire session is not sampled, use the below sample rate to sample
		// sessions when an error occurs.
		replaysOnErrorSampleRate: 1.0,

		// If you don't want to use Session Replay, just remove the line below:
		integrations: [new Replay()]
	});
} catch {
	console.log('failed to initiate sentry');
}

export const handleError: HandleClientError = async ({ error, event }) => {
	const errorId = crypto.randomUUID();
	Sentry.captureException(error, { extra: { event, errorId } });

	console.log(error, event);

	if (!navigator.onLine) {
		return {
			message: 'You are offline',
			errorId: 'Offline',
			status: 523
		};
	}

	return {
		message: 'A client side error occurred',
		status: 400,
		errorId
	};
};
