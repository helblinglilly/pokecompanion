import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { logError } from '$lib/log';
import Pocketbase from 'pocketbase';

export const load = async ({ params }) => {
	const pb = new Pocketbase(PUBLIC_POCKETBASE_URL);
	try {
		await pb.collection('users').confirmVerification(params.token);
		return {
			success: true
		};
	} catch (err) {
		logError('Email verification failed', 'FailedEmailVerification', err);
		return {
			success: false
		};
	}
};
