import type { paths } from '$/@types/api.js';
import { PRIVATE_API_HOST } from '$env/static/private';

export const load = async ({ params }) => {
	try {
		const res = await fetch(`${PRIVATE_API_HOST}/auth/verify`, {
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
