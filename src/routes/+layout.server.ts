import type { LayoutServerLoad } from './$types';
import { SettingNames } from '$lib/stores/domain';

export const load: LayoutServerLoad = async ({ cookies }) => {
	return {
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
