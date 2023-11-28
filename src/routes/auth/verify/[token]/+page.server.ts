import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import Pocketbase from 'pocketbase';

export const load = async ({ params }) => {
	const pb = new Pocketbase(PUBLIC_POCKETBASE_URL);
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
