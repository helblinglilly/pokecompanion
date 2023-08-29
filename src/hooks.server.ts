import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import type { HandleServerError } from '@sveltejs/kit';
import crypto from 'crypto';

Sentry.init({
	dsn: 'https://7772cafd20f486c28a438b4544b2b8f8@o4505790206705664.ingest.sentry.io/4505790208278528',
	tracesSampleRate: 1
});

export const handleError: HandleServerError = async ({ error, event }) => {
	const errorId = crypto.randomUUID();
	Sentry.captureException(error, { extra: { event, errorId } });

	console.dir({
		level: 'ERROR',
		timestamp: new Date().toISOString(),
		errorId: errorId,
		stacktrace: error,
		event
	});

	return {
		message: 'Server side error',
		errorId
	};
};

export const handle = sequence(Sentry.sentryHandle());
