import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import type { HandleServerError } from '@sveltejs/kit';
import crypto from 'crypto';
import { SENTRY_DSN } from '$env/static/private';

Sentry.init({
	dsn: SENTRY_DSN,
	tracesSampleRate: 1
});

export const handleError: HandleServerError = async ({ error, event }) => {
	const errorId = crypto.randomUUID();
	if (process.env.NODE_ENV === 'production') {
		Sentry.captureException(error, { extra: { event, errorId } });
	}

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
