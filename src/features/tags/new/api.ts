import type { paths } from '$/@types/api';
import { PUBLIC_API_HOST } from '$env/static/public';

export const createNewTag = async (
	requestBody: paths['/tags']['post']['requestBody']['content']['application/json']
) => {
	try {
		const url = new URL('/tags', PUBLIC_API_HOST);

		const res = await fetch(url, {
			credentials: 'include',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(requestBody)
		});
		return res.status;
	} catch (err) {
		return 500;
	}
};
