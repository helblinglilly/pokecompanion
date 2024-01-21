import { currentUser } from '$lib/stores/user';
import * as Sentry from '@sentry/browser';
import type { HandleServerError } from '@sveltejs/kit';
import { get } from 'svelte/store';

export const handleError: HandleServerError = async ({ error, event, status, message }) => {
	const errorId = crypto.randomUUID();

	Sentry.withScope(function (scope) {
		scope.setTag('rememberToken', event.cookies.get('remember-token'));

		const userDetails = get(currentUser);
		if (userDetails) {
			scope.setUser({
				id: userDetails.id,
				email: userDetails.email
				// Add any other relevant user details here
			});
		}

		scope.setExtras({
			selectedGame: event.cookies.get('selectedGame'),
			primaryLanguage: event.cookies.get('primaryLanguage'),
			secondaryLanguage: event.cookies.get('secondaryLanguage'),
			versionSpecificSprites: event.cookies.get('versionSpecificSprites'),
			animateSprites: event.cookies.get('animateSprites')
		});

		Sentry.captureException(error);
	});

	console.log('hello');
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
