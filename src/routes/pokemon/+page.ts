import { PUBLIC_API_HOST } from '$env/static/public';
import type { APIPokemonRootPreview } from '$/@types/api.pokecompanion';
import { addSettingsToUrl, resolveSettings, DEPENDS_SETTINGS } from '$lib/api/settings';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, fetch, depends, parent }) => {
	depends('app:pokemonRootParams');
	depends(DEPENDS_SETTINGS);

	const { settings: serverSettings } = await parent();
	const settings = resolveSettings(serverSettings);

	const apiRequest = addSettingsToUrl(
		new URL(`${PUBLIC_API_HOST}/pokemon/preview`),
		settings,
		url.searchParams
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
};
