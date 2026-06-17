import type { paths } from '$/@types/api';

export const load = async ({ fetch }) => {
	try {
		const res = await fetch('/api-proxy/auth/methods');

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
