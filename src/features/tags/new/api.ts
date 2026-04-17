import type { paths } from '$/@types/api';
import { PUBLIC_API_HOST } from '$env/static/public';

export const createNewTag = async (
	requestBody: paths['/tags']['post']['requestBody']['content']['application/json']
) => {
	try {
		const res = await fetch(`${PUBLIC_API_HOST}/tags`, {
			credentials: 'include',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(requestBody)
		});

		if (res.ok) {
			const body =
				(await res.json()) as paths['/tags']['post']['responses']['201']['content']['application/json'];
			return {
				status: res.status,
				tagId: body
			};
		}

		return {
			status: res.status,
			tagId: ''
		};
	} catch {
		return {
			status: 500,
			tagId: ''
		};
	}
};
