import { PUBLIC_API_HOST } from '$env/static/public';
import type { APIPokemonRootPreview } from '$/@types/api.pokecompanion';

export async function load({ url, fetch, parent }) {
	const { preferences } = await parent();

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

	if (preferences.animateSprites) {
		apiRequest.searchParams.append('animateSprites', preferences.animateSprites);
	}
	if (preferences.primaryLanguage) {
		apiRequest.searchParams.append('primaryLanguage', preferences.primaryLanguage);
	}
	if (preferences.secondaryLanguage) {
		apiRequest.searchParams.append('secondaryLanguage', preferences.secondaryLanguage);
	}
	if (preferences.selectedGame) {
		apiRequest.searchParams.append('selectedGame', preferences.selectedGame);
	}
	if (preferences.versionSpecificPokemonSprites) {
		apiRequest.searchParams.append(
			'versionSpecificPokemonSprites',
			preferences.versionSpecificPokemonSprites
		);
	}
	if (preferences.versionSpecificTypeSprites) {
		apiRequest.searchParams.append(
			'versionSpecificTypeSprites',
			preferences.versionSpecificTypeSprites
		);
	}

	const res = await fetch(apiRequest);
	const body = (await res.json()) as APIPokemonRootPreview;

	return {
		...body
	};
}
