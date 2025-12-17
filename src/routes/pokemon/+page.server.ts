import { PUBLIC_API_HOST } from '$env/static/public';
import type { APIPokemonRootPreview } from '$/@types/api.pokecompanion';
import { addCookiesAsSearchParams } from '$/lib/api/fetch';

export async function load({ url, fetch, cookies, depends }) {
	depends('app:pokemonRootParams');
	const apiRequest = addCookiesAsSearchParams(
		new URL(`${PUBLIC_API_HOST}/pokemon/preview`),
		url,
		cookies
	);

	const jumpTo = url.searchParams.get('jumpTo');
	if (jumpTo) {
		apiRequest.searchParams.append('jumpTo', jumpTo);
	}

	const page = url.searchParams.get('page');
	if (page) {
		apiRequest.searchParams.append('page', page);
	}

	const res = await fetch(apiRequest);
	const body = (await res.json()) as APIPokemonRootPreview;

	return {
		...body
	};
}
