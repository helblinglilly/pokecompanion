import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	return {
		user: locals.user,
		preferences: {
			animateSprites: cookies.get('animateSprites'),
			primaryLanguage: cookies.get('primaryLanguage'),
			secondaryLanguage: cookies.get('secondaryLanguage'),
			selectedGame: cookies.get('selectedGame'),
			versionSpecificPokemonSprites: cookies.get('versionSpecificPokemonSprites'),
			versionSpecificTypeSprites: cookies.get('versionSpecificTypeSprites')
		}
	};
};
