import type { paths } from '$/@types/api';
import { PUBLIC_API_HOST } from '$env/static/public';

export const load = async ({ fetch }) => {
	try {
		const res = await fetch(`${PUBLIC_API_HOST}/auth/methods`, {
			credentials: 'include'
		});

		const body =
			(await res.json()) as paths['/auth/methods']['get']['responses']['200']['content']['application/json'];

		return body;
	} catch (err) {
		console.error(err);
		return {
			oAuth: [],
			password: false
		} as paths['/auth/methods']['get']['responses']['200']['content']['application/json'];
	}
};
