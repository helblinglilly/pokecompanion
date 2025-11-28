import type { paths } from '$/@types/api';
import { PUBLIC_API_HOST } from '$env/static/public';
import { Logger } from '$lib/log';

export const getUserByUsername = async (username: string) => {
	if (!username) {
		return;
	}
	try {
		const res = await fetch(`${PUBLIC_API_HOST}/user/${username}`, {
			credentials: 'include'
		});
		if (res.status !== 200) {
			throw new Error(`Non-200 status code ${res.status}`);
		}

		const body =
			(await res.json()) as paths['/user/{username}']['get']['responses']['200']['content']['application/json'];
		return body;
	} catch (err) {
		await Logger.error(Logger.ErrorClasses.UserOperation, Logger.buildError(err), {
			context: 'Failed to get user by username',
			username
		});
		return;
	}
};
