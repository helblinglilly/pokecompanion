import type { HandleServerError } from '@sveltejs/kit';
import { uuid } from './lib/utils/uuid';
export const handleError: HandleServerError = async ({ status, message }) => {
	const errorId = uuid();

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
