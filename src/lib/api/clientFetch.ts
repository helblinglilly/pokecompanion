import { get } from 'svelte/store';
import {
	animateSprites,
	primaryLanguage,
	secondaryLanguage,
	selectedGame,
	SettingNames,
	versionSpecificPokemonSprites,
	versionSpecificTypeSprites
} from '../stores/domain';

export function addSettingsAsSearchParams(baseUrl: URL, searchParams: URLSearchParams) {
	const primaryLanguageSetting =
		searchParams.get(SettingNames.PrimaryLanguage) ?? get(primaryLanguage);
	if (primaryLanguageSetting) {
		baseUrl.searchParams.append(SettingNames.PrimaryLanguage, primaryLanguageSetting);
	}

	const secondaryLanguageSetting =
		searchParams.get(SettingNames.SecondaryLanguage) ?? get(secondaryLanguage);
	if (secondaryLanguageSetting) {
		baseUrl.searchParams.append(SettingNames.SecondaryLanguage, secondaryLanguageSetting);
	}

	const animateSpritesSetting =
		searchParams.get(SettingNames.AnimateSprites) === 'true' || get(animateSprites);
	if (animateSpritesSetting) {
		baseUrl.searchParams.append(SettingNames.AnimateSprites, `${animateSpritesSetting}`);
	}

	const game = searchParams.get(SettingNames.SelectedGame) ?? get(selectedGame)?.pokeapi;
	if (game) {
		baseUrl.searchParams.append(SettingNames.SelectedGame, game);
	}

	baseUrl.searchParams.append(
		SettingNames.VersionSpecificPokemonSprites,
		get(versionSpecificPokemonSprites) ? 'true' : 'false'
	);

	baseUrl.searchParams.append(
		SettingNames.VersionSpecificTypeSprites,
		get(versionSpecificTypeSprites) ? 'true' : 'false'
	);

	if (searchParams.get('shiny')) {
		baseUrl.searchParams.append('shiny', searchParams.get('shiny') ?? '');
	}
	if (searchParams.get('gender')) {
		baseUrl.searchParams.append('gender', searchParams.get('gender') ?? '');
	}
	if (searchParams.get('variety')) {
		baseUrl.searchParams.append('variety', searchParams.get('variety') ?? '');
	}

	return baseUrl;
}
