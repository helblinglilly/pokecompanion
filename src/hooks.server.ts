import { PUBLIC_ENVIRONMENT, PUBLIC_POCKETBASE_URL, PUBLIC_SENTRY_DSN } from '$env/static/public';
import PocketBase from 'pocketbase';
import { getRawCookie } from '$lib/utils/cookies';
// Error handling needs revisiting: https://kit.svelte.dev/docs/migrating-to-sveltekit-2#improved-error-handling
/*
Workaround for Github Issue: https://github.com/getsentry/sentry-javascript/issues/8291
Will need to switch to permanent fix once available
 */
import { init } from '@jill64/sentry-sveltekit-cloudflare/server';
import { error } from '$lib/log';

const { onHandle, onError } = init(
	PUBLIC_SENTRY_DSN,
	{
		toucanOptions: {
			environment: PUBLIC_ENVIRONMENT
		}
	}
	// ,
	// {
	//   toucanOptions: {
	//     // ... Other Sentry Config
	//   },
	//   handleOptions: {
	//     handleUnknownRoutes: boolean (default: false)
	//   },
	//   enableInDevMode: boolean (default: false)
	// }
);
export const handleError = onError((e, sentryEventId) => {
	console.dir({
		level: 'ERROR',
		timestamp: new Date().toISOString(),
		errorId: sentryEventId,
		stackTrace: e.error
	});
	error(e.message, sentryEventId ?? 'unknown-serverside-error', {
		status: e.status
	});
});

export const handle = onHandle(async ({ event, resolve }) => {
	// Your Handle Code
	// Must initialise PB so that it's available in other server actions
	const pb = new PocketBase(PUBLIC_POCKETBASE_URL);

	const cookieString = event.request.headers.get('cookie') ?? '';
	const pbAuth = getRawCookie(cookieString, 'pb_auth') ?? '';

	pb.authStore.loadFromCookie(pbAuth);

	event.locals.pb = pb;
	event.locals.user = pb.authStore.model;

	const response = await resolve(event);

	return response;
});
