import { PUBLIC_API_HOST } from '$env/static/public';
import type { APIPokemonRootPreview } from '$/@types/api.pokecompanion';

export async function load({ url, fetch }) {
	const apiRequest = new URL(`${PUBLIC_API_HOST}/pokemon/preview`);

	const jumpTo = url.searchParams.get('jumpTo');
	if (jumpTo) {
		apiRequest.searchParams.append('jumpTo', jumpTo);
	}

	const page = url.searchParams.get('page');
	if (page) {
		apiRequest.searchParams.append('page', page);
	}

	const pageSize = url.searchParams.get('pageSize');
	if (pageSize) {
		apiRequest.searchParams.append('pageSize', pageSize);
	}

	const res = await fetch(apiRequest);
	const body = (await res.json()) as APIPokemonRootPreview;

	return {
		...body
	};
}
