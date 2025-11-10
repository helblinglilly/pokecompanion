import type { paths } from '$/@types/api.js';
import { PUBLIC_API_HOST } from '$env/static/public';

export const load = async ({ params }) => {
	try {
		const res = await fetch(`${PUBLIC_API_HOST}/auth/verify`, {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({
				token: params.token
			})
		});

		const response =
			(await res.json()) as paths['/auth/verify']['post']['responses']['200']['content']['application/json'];
		return response;
	} catch (err) {
		return {
			success: false
		} as paths['/auth/verify']['post']['responses']['200']['content']['application/json'];
	}
};
