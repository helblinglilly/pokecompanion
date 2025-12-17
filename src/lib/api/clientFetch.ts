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

export function addSettingsAsSearchParams(baseUrl: URL, requestUrl: URL) {
	const primaryLanguageSetting =
		requestUrl.searchParams.get(SettingNames.PrimaryLanguage) ?? get(primaryLanguage);
	if (primaryLanguageSetting) {
		baseUrl.searchParams.append(SettingNames.PrimaryLanguage, primaryLanguageSetting);
	}

	const secondaryLanguageSetting =
		requestUrl.searchParams.get(SettingNames.SecondaryLanguage) ?? get(secondaryLanguage);
	if (secondaryLanguageSetting) {
		baseUrl.searchParams.append(SettingNames.SecondaryLanguage, secondaryLanguageSetting);
	}

	const animateSpritesSetting =
		requestUrl.searchParams.get(SettingNames.AnimateSprites) === 'true' || get(animateSprites);
	if (animateSpritesSetting) {
		baseUrl.searchParams.append(SettingNames.AnimateSprites, `${animateSpritesSetting}`);
	}

	const game = requestUrl.searchParams.get(SettingNames.SelectedGame) ?? get(selectedGame)?.pokeapi;
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

	if (requestUrl.searchParams.get('shiny')) {
		baseUrl.searchParams.append('shiny', requestUrl.searchParams.get('shiny') ?? '');
	}
	if (requestUrl.searchParams.get('gender')) {
		baseUrl.searchParams.append('gender', requestUrl.searchParams.get('gender') ?? '');
	}
	if (requestUrl.searchParams.get('variety')) {
		baseUrl.searchParams.append('variety', requestUrl.searchParams.get('variety') ?? '');
	}

	return baseUrl;
}
