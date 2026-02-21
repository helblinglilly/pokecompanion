import { browser } from '$app/environment';

/** Dependency key used by page loads that need to re-run when user settings change. */
export const DEPENDS_SETTINGS = 'app:settings';
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

export interface UserSettings {
	primaryLanguage: string;
	secondaryLanguage: string;
	selectedGame: string;
	animateSprites: string;
	versionSpecificPokemonSprites: string;
	versionSpecificTypeSprites: string;
}

/**
 * Resolves user settings from the correct source depending on context.
 *
 * - During SSR: stores contain hardcoded defaults and cookieHandlers haven't run,
 *   so we use the server-provided settings (read from cookies in +layout.server.ts).
 * - During client-side navigation: stores have been initialised by cookieHandlers
 *   and may be more up-to-date (e.g. user changed a setting without a full reload),
 *   so we prefer the live store values.
 */
export function resolveSettings(serverSettings: UserSettings): UserSettings {
	if (browser) {
		return {
			primaryLanguage: get(primaryLanguage) ?? serverSettings.primaryLanguage,
			secondaryLanguage: get(secondaryLanguage) ?? serverSettings.secondaryLanguage,
			selectedGame: get(selectedGame)?.pokeapi ?? serverSettings.selectedGame,
			animateSprites: `${get(animateSprites)}`,
			versionSpecificPokemonSprites: get(versionSpecificPokemonSprites) ? 'true' : 'false',
			versionSpecificTypeSprites: get(versionSpecificTypeSprites) ? 'true' : 'false'
		};
	}
	return serverSettings;
}

/**
 * Applies resolved user settings and URL search params onto an API request URL.
 *
 * This replaces both `addCookiesAsSearchParams` (server) and
 * `addSettingsAsSearchParams` (client) with a single function that works
 * in universal load functions (+page.ts / +layout.ts).
 */
export function addSettingsToUrl(
	baseUrl: URL,
	settings: UserSettings,
	searchParams?: URLSearchParams
): URL {
	const sp = searchParams ?? new URLSearchParams();

	baseUrl.searchParams.append(
		SettingNames.PrimaryLanguage,
		sp.get(SettingNames.PrimaryLanguage) ?? settings.primaryLanguage
	);

	baseUrl.searchParams.append(
		SettingNames.SecondaryLanguage,
		sp.get(SettingNames.SecondaryLanguage) ?? settings.secondaryLanguage
	);

	baseUrl.searchParams.append('variety', sp.get('variety') ?? '');
	baseUrl.searchParams.append('shiny', sp.get('shiny') ?? '');
	baseUrl.searchParams.append('gender', sp.get('gender') ?? '');

	baseUrl.searchParams.append(
		'animateSprites',
		sp.get(SettingNames.AnimateSprites) ?? settings.animateSprites
	);

	const game = sp.get('game') ?? sp.get(SettingNames.SelectedGame) ?? settings.selectedGame;
	if (game) {
		baseUrl.searchParams.append('game', game);
	}

	const versionSpecificPokemon =
		sp.get(SettingNames.VersionSpecificPokemonSprites) ?? settings.versionSpecificPokemonSprites;
	baseUrl.searchParams.append('versionSpecificPokemonSprites', `${versionSpecificPokemon}`);

	const versionSpecificType =
		sp.get(SettingNames.VersionSpecificTypeSprites) ??
		(versionSpecificPokemon === 'true' ? 'true' : settings.versionSpecificTypeSprites);
	baseUrl.searchParams.append('versionSpecificTypeSprites', `${versionSpecificType}`);

	return baseUrl;
}
