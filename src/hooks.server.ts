import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import type { HandleServerError } from '@sveltejs/kit';
import crypto from 'crypto';
import { PUBLIC_SENTRY_DSN } from '$env/static/public';

import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import Google from '@auth/core/providers/google';
import {
	AUTH_SECRET,
	GITHUB_ID,
	GITHUB_SECRET,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET
} from '$env/static/private';

export const handleAuth = SvelteKitAuth({
	providers: [
		GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
		Google({ clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET })
	],
	trustHost: true,
	secret: AUTH_SECRET
	// session: {
	// 	strategy: 'database'
	// }
});

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

export const handle = sequence(handleAuth, Sentry.sentryHandle());
