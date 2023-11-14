import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import type { Handle, HandleServerError } from '@sveltejs/kit';
import crypto from 'crypto';
import { PUBLIC_SENTRY_DSN } from '$env/static/public';
import { createInstance } from '$lib/pocketbase';

try {
	Sentry.init({
		dsn: PUBLIC_SENTRY_DSN,
		tracesSampleRate: 1
	});
} catch (err) {
	console.error(`Failed to initialise sentry (server side)`, err);
}

export const handleError: HandleServerError = async ({ error, event }) => {
	const errorId = crypto.randomUUID();

	if (process.env.NODE_ENV === 'production') {
		try {
			Sentry.captureException(error, { extra: { event, errorId } });
		} catch (err) {
			console.log(`Failed to initialise sentry exception catpure`, err);
		}
	}

	if (error && typeof error === 'object') {
		if (error.toString().includes('Error: Not found:')) {
			return {
				message: 'Page not found',
				status: 404,
				errorId: '404'
			};
		}
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
		status: 500,
		errorId
	};
};

export const handleAuth: Handle = async ({ event, resolve }) => {
	const pb = createInstance();

	// load the store data from the request cookie string
	pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
	try {
		// get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
		if (pb.authStore.isValid) {
			await pb.collection('users').authRefresh();
		}
	} catch (_) {
		// clear the auth store on failed refresh
		pb.authStore.clear();
	}

	event.locals.pb = pb;
	event.locals.user = pb.authStore.model;

	const response = await resolve(event);

	// send back the default 'pb_auth' cookie to the client with the latest store state
	response.headers.set('set-cookie', pb.authStore.exportToCookie({ httpOnly: false }));

	return response;
};

export const handle = sequence(handleAuth, Sentry.sentryHandle());
