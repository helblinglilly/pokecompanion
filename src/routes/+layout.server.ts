import type { LayoutServerLoad } from './$types';
import { SettingNames } from '$lib/stores/domain';
import type { AuthRecord } from '$lib/stores/user';

const getCurrentUser = (authCookie: string | undefined): AuthRecord | null => {
	if (!authCookie) {
		return null;
	}

	try {
		const authData = JSON.parse(decodeURIComponent(authCookie)) as {
			record?: AuthRecord;
		};

		return authData.record ?? null;
	} catch {
		return null;
	}
};


export const load: LayoutServerLoad = async ({ cookies }) => {
  return {
    currentUser: getCurrentUser(cookies.get('pb_auth')),
		settings: {
			primaryLanguage: cookies.get(SettingNames.PrimaryLanguage) ?? 'en',
			secondaryLanguage: cookies.get(SettingNames.SecondaryLanguage) ?? '',
			selectedGame: cookies.get(SettingNames.SelectedGame) ?? '',
			animateSprites: cookies.get(SettingNames.AnimateSprites) ?? 'true',
			versionSpecificPokemonSprites:
				cookies.get(SettingNames.VersionSpecificPokemonSprites) ?? 'true',
			versionSpecificTypeSprites:
				cookies.get(SettingNames.VersionSpecificTypeSprites) ?? 'false'
		}
	};
};
