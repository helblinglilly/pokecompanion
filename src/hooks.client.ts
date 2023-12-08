import * as Sentry from '@sentry/browser';
import type { HandleClientError } from '@sveltejs/kit';

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
