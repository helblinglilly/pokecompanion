import type { paths } from '$/@types/api.js';
import { addCookiesAsSearchParams } from '$/lib/api/fetch.js';
import { PUBLIC_API_HOST } from '$env/static/public';

export const load = async ({ fetch, url, cookies }) => {
	const searchRequestUrl = addCookiesAsSearchParams(
		new URL(`${PUBLIC_API_HOST}/search?term=${url.searchParams.get('term')}`),
		url.searchParams,
		cookies
	);

	const res = await fetch(searchRequestUrl, {
		credentials: 'include'
	});
	const body =
		(await res.json()) as paths['/search']['get']['responses']['200']['content']['application/json'];

	return {
		...body,
		errorMessage: ''
	};
};
