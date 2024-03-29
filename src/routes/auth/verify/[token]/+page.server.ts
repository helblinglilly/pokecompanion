import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { Logger } from '$lib/log.js';
import Pocketbase from 'pocketbase';

export const load = async ({ params, platform }) => {
	const pb = new Pocketbase(PUBLIC_POCKETBASE_URL);
	try {
		await pb.collection('users').confirmVerification(params.token);
		return {
			success: true
		};
	} catch (err) {
		platform?.context.waitUntil(
			Logger.error(
				Logger.ErrorClasses.UserOperation,
				Logger.buildError(err),
				{
					context: 'Email verification failed',
				}
			)
		)
		return {
			success: false
		};
	}
};
