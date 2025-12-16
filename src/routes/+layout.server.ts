import type { APIMeta } from '$/@types/api.pokecompanion';
import { PUBLIC_API_HOST } from '$env/static/public';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
	let languages: APIMeta['languages'] = [];
	let games: APIMeta['games'] = [];
	let lastPokedexEntry: APIMeta['lastPokedexEntry'] = 1;

	try {
		const res = await fetch(`${PUBLIC_API_HOST}/meta`, {
			credentials: 'include'
		});

		const body = (await res.json()) as APIMeta;

		games = body.games;
		languages = body.languages;
		lastPokedexEntry = body.lastPokedexEntry;
	} catch (err) {
		console.error(`Failed to get the main config ${err}`);
	}

	return {
		preferences: {
			animateSprites: cookies.get('animateSprites'),
			primaryLanguage: cookies.get('primaryLanguage'),
			secondaryLanguage: cookies.get('secondaryLanguage'),
			selectedGame: cookies.get('selectedGame'),
			versionSpecificPokemonSprites: cookies.get('versionSpecificPokemonSprites'),
			versionSpecificTypeSprites: cookies.get('versionSpecificTypeSprites')
		},
		games,
		languages,
		lastPokedexEntry
	};
};
