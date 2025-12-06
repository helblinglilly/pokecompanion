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
	baseUrl.searchParams.append(SettingNames.PrimaryLanguage, get(primaryLanguage));
	baseUrl.searchParams.append(SettingNames.SecondaryLanguage, get(secondaryLanguage) ?? '');
	baseUrl.searchParams.append(SettingNames.AnimateSprites, get(animateSprites) ? 'true' : 'false');
	baseUrl.searchParams.append(SettingNames.SelectedGame, get(selectedGame)?.pokeapi ?? '');
	baseUrl.searchParams.append(
		SettingNames.VersionSpecificPokemonSprites,
		get(versionSpecificPokemonSprites) ? 'true' : 'false'
	);
	baseUrl.searchParams.append(
		SettingNames.VersionSpecificTypeSprites,
		get(versionSpecificTypeSprites) ? 'true' : 'false'
	);

	baseUrl.searchParams.append('shiny', requestUrl.searchParams.get('shiny') ?? '');
	baseUrl.searchParams.append('gender', requestUrl.searchParams.get('gender') ?? '');

	return baseUrl;
}
