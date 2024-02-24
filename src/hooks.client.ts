import * as Sentry from '@sentry/browser';
import type { HandleServerError } from '@sveltejs/kit';
export const handleError: HandleServerError = async ({ error, event, status, message }) => {
	const errorId = crypto.randomUUID();

	Sentry.captureException(error);

	console.log(error, event);

	if (!navigator.onLine) {
		return {
			message: 'You are offline',
			errorId: 'Offline',
			status: 523
		};
	}

	return {
		message,
		status: 400,
		errorId: errorId
	};
};
