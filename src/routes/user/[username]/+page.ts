import type { paths } from '$/@types/api.js';
import { PUBLIC_API_HOST } from '$env/static/public';
import { error } from '@sveltejs/kit';

export const load = async ({ params, depends }) => {
	depends('tags:all');
	depends('user:all');
	const res = await fetch(PUBLIC_API_HOST + `/user/${params.username}`);

	if (res.status === 404) {
		error(404, 'This user does not exist');
	}
	if (res.status !== 200) {
		error(res.status, 'Something went wrong');
	}
	const body =
		(await res.json()) as paths['/user/{username}']['get']['responses']['200']['content']['application/json'];

	return body;
};
