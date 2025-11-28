import { PUBLIC_ENVIRONMENT, PUBLIC_SENTRY_DSN } from '$env/static/public';
// Error handling needs revisiting: https://kit.svelte.dev/docs/migrating-to-sveltekit-2#improved-error-handling
/*
Workaround for Github Issue: https://github.com/getsentry/sentry-javascript/issues/8291
Will need to switch to permanent fix once available
 */
import { init } from '@jill64/sentry-sveltekit-cloudflare/server';
import { Logger } from '$lib/log';

const { onError } = init(
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
