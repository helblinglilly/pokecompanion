import type { paths } from '$/@types/api';
import { PUBLIC_API_HOST } from '$env/static/public';

export const load = async ({ fetch }) => {
	try {
		console.log(PUBLIC_API_HOST);
		const res = await fetch(`${PUBLIC_API_HOST}/auth/methods`);

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
