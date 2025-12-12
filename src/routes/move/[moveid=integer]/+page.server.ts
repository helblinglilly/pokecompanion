import { PUBLIC_API_HOST } from '$env/static/public';
import { addCookiesAsSearchParams } from '$/lib/api/fetch.js';
import type { paths } from '$/@types/api';

export async function load({ params, cookies, fetch, url }) {
	const requestUrl = addCookiesAsSearchParams(
		new URL(`${PUBLIC_API_HOST}/move/${params.moveid}`),
		url,
		cookies
	);

	const res = await fetch(requestUrl, {
		credentials: 'include'
	});

  const move = (await res.json()) as paths['/move/{id}']['get']['responses']['200']['content']['application/json'];
	return {
		move
	};
}
