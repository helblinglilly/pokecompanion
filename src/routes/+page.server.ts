import type { paths } from '$/@types/api.js';
import { addCookiesAsSearchParams } from '$/lib/api/fetch.js';
import { PUBLIC_API_HOST } from '$env/static/public';

export async function load({ cookies, url, fetch }) {
	async function getHomeContents() {
		const homeUrl = addCookiesAsSearchParams(
			new URL(`${PUBLIC_API_HOST}/home`),
			url.searchParams,
			cookies
		);

		const res = await fetch(homeUrl, {
			credentials: 'include'
		});

		return (await res.json()) as paths['/home']['get']['responses']['200']['content']['application/json'];
	}

	return {
		data: getHomeContents()
	};
}
