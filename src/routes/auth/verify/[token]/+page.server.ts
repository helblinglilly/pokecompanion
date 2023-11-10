import { pb } from '$lib/pocketbase.js';

export const load = async ({ params }) => {
	try {
		await pb.collection('users').confirmVerification(params.token);
		return {
			success: true
		};
	} catch (err) {
		console.error('Email verification failed', err);
		return {
			success: false
		};
	}
};
