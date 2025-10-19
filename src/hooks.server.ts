import { PUBLIC_ENVIRONMENT, PUBLIC_POCKETBASE_URL, PUBLIC_SENTRY_DSN } from '$env/static/public';
import PocketBase from 'pocketbase';
import { getRawCookie } from '$lib/utils/cookies';
// Error handling needs revisiting: https://kit.svelte.dev/docs/migrating-to-sveltekit-2#improved-error-handling
/*
Workaround for Github Issue: https://github.com/getsentry/sentry-javascript/issues/8291
Will need to switch to permanent fix once available
 */
import { init } from '@jill64/sentry-sveltekit-cloudflare/server';
import { Logger } from '$lib/log';

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
export const handleError = onError(async (e) => {
	try {
		console.log('server-side error', e);
		await Logger.error(Logger.ErrorClasses.Unknown, Logger.buildError(e.error), {
			context: 'Unknown error caught in hooks.server',
			event: e.event.url,
			statusMessage: e.status,
			message: e.message,
			stackTrace: e.error
		});
	} catch (err) {
		console.log('Reporting a server-side error failed with', err);
		console.log('for error', e);
	}
});

export const handle = onHandle(async ({ event, resolve }) => {
	// Must initialise PB so that it's available in other server actions
	const pb = new PocketBase(PUBLIC_POCKETBASE_URL);

	const cookieString = event.request.headers.get('cookie') ?? '';
	const pbAuth = getRawCookie(cookieString, 'pb_auth') ?? '';

	pb.authStore.loadFromCookie(pbAuth);

	try {
		// get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
		pb.authStore.isValid && (await pb.collection('users').authRefresh());
	} catch (err) {
		// clear the auth store on failed refresh
		pb.authStore.clear();
	}

	event.locals.pb = pb;
	event.locals.user = pb.authStore.record;

	return await resolve(event);
});
