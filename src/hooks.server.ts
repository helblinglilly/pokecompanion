/*
	Server side sentry logging is not yet supported in non-node
	environments such as cloudflare or vercel.
	So server side logging is disabeled for now.
	Github Issue: https://github.com/getsentry/sentry-javascript/issues/8291
*/
// import { sequence } from '@sveltejs/kit/hooks';
// import * as Sentry from '@sentry/sveltekit';
import type { Handle, HandleServerError } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import PocketBase from 'pocketbase';
import { getRawCookie } from '$lib/utils/cookies';

// Needs revisiting: https://kit.svelte.dev/docs/migrating-to-sveltekit-2#improved-error-handling
export const handleError: HandleServerError = async ({ error, event }) => {
	const errorId = uuidv4();

	if (process.env.NODE_ENV === 'production') {
		try {
			// Sentry.captureException(error, { extra: { event, errorId } });
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

export const handle: Handle = async ({ event, resolve }) => {
	// Must initialise PB so that it's available in other server actions
	const pb = new PocketBase(PUBLIC_POCKETBASE_URL);

	const cookieString = event.request.headers.get('cookie') ?? '';
	const pbAuth = getRawCookie(cookieString, 'pb_auth') ?? '';

	pb.authStore.loadFromCookie(pbAuth);

	event.locals.pb = pb;
	event.locals.user = pb.authStore.model;

	const response = await resolve(event);

	return response;
};
