import type { HandleServerError } from '@sveltejs/kit';
export const handleError: HandleServerError = async ({ status, message }) => {
	const errorId = crypto.randomUUID();

	if (!navigator.onLine) {
		return {
			message: 'You are offline',
			errorId: 'Offline',
			status: 523
		};
	}

	return {
		message,
		status,
		errorId: errorId
	};
};
