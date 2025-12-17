import { PUBLIC_API_HOST } from '$env/static/public';
import type { APIPokemonRootPreview } from '$/@types/api.pokecompanion';
import { addSettingsAsSearchParams } from '$/lib/api/clientFetch.js';

export async function load({ url, fetch }) {
	const apiRequest = addSettingsAsSearchParams(new URL(`${PUBLIC_API_HOST}/pokemon/preview`), url);

	const jumpTo = url.searchParams.get('jumpTo');
	if (jumpTo) {
		apiRequest.searchParams.append('jumpTo', jumpTo);
	}

	const res = await fetch(apiRequest);
	const body = (await res.json()) as APIPokemonRootPreview;

	return {
		...body
	};
}
