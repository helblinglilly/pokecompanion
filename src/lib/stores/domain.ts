import { get, writable } from 'svelte/store';
import { getCookie, getRawCookie, setCookie } from '../utils/cookies';
import { currentUser, type AuthRecord } from './user';
import { v4 as uuid } from 'uuid';
import { page } from '$app/stores';
import type {
	MetaGame,
	PokeapiLanguageCodes,
	PokeapiVersionGroups
} from '$/@types/api.pokecompanion';
import type { paths } from '$/@types/api';

export const theme = writable<'dark' | 'light' | undefined>();
export const selectedGame = writable<MetaGame | undefined>();
export const primaryLanguage = writable<PokeapiLanguageCodes>('en');
export const secondaryLanguage = writable<PokeapiLanguageCodes | undefined>();
export const versionSpecificPokemonSprites = writable<boolean>(true);
export const versionSpecificTypeSprites = writable<boolean>(false);
export const animateSprites = writable<boolean>(true);
export const rememberToken = writable<string>(uuid());
export const meta = writable<
	paths['/meta']['get']['responses']['200']['content']['application/json'] & {
		preferences: {
			animateSprites: boolean;
		};
	}
>({
	lastPokedexEntry: 1,
	games: [],
	languages: [],
	preferences: {
		animateSprites: false
	}
});
export const maxSearchResults = 15;
export const pokemonPageSize = 50;

export enum SettingNames {
	SelectedGame = 'selectedGame',
	PrimaryLanguage = 'primaryLanguage',
	SecondaryLanguage = 'secondaryLanguage',
	VersionSpecificPokemonSprites = 'versionSpecificPokemonSprites',
	VersionSpecificTypeSprites = 'versionSpecificTypeSprites',
	AnimateSprites = 'animateSprites'
}

export type UserPreferencePokemonVersion = PokeapiVersionGroups | undefined;

export const cookieHandlers = {
	selectedGame: () => {
		const isInSearchParam = get(page).url.searchParams.get('game') as UserPreferencePokemonVersion;

		let existingValue = getCookie(SettingNames.SelectedGame) as UserPreferencePokemonVersion;

		if (isInSearchParam) {
			existingValue = isInSearchParam;
		} else {
			if (!existingValue) {
				existingValue = 'legends-za';
				setCookie(SettingNames.SelectedGame, existingValue);
			}
		}

		const game =
			get(meta).games.find((metaGame) => metaGame.pokeapi === existingValue) ??
			get(meta).games[get(meta).games.length - 1];

		selectedGame.set(game);

		selectedGame.subscribe((value) => {
			window?.newrelic?.setCustomAttribute(SettingNames.SelectedGame, value?.pokeapi);

			const isInSearchParam = get(page).url.searchParams.get('game');

			if (isInSearchParam) {
				return;
			}

			if (!value) {
				setCookie(SettingNames.SelectedGame, 'generic');
				return;
			}

			const existingCookie = getCookie(SettingNames.SelectedGame) as MetaGame['pokeapi'];
			let existingValue = undefined;

			if (existingCookie) {
				existingValue = get(meta).games.find((metaGame) => metaGame.pokeapi === existingCookie);
			}

			if (!existingValue || value.pokeapi !== existingValue.pokeapi) {
				setCookie(SettingNames.SelectedGame, value.pokeapi);
			}
		});
	},
	primaryLanguage: () => {
		const isInSearchParam = get(page).url.searchParams.get(SettingNames.PrimaryLanguage);
		let existingValue = getCookie(SettingNames.PrimaryLanguage);

		if (isInSearchParam) {
			existingValue = isInSearchParam;
		} else {
			if (!existingValue) {
				existingValue = 'en';
				setCookie(SettingNames.PrimaryLanguage, existingValue);
			}
		}

		primaryLanguage.set(existingValue as PokeapiLanguageCodes);

		primaryLanguage.subscribe((value) => {
			window?.newrelic?.setCustomAttribute(SettingNames.PrimaryLanguage, value);
			const isInSearchParam = get(page).url.searchParams.get(SettingNames.PrimaryLanguage);

			if (!value || isInSearchParam) {
				return;
			}
			const existing = getCookie(SettingNames.PrimaryLanguage);
			if (!existing || value !== existing) {
				setCookie(SettingNames.PrimaryLanguage, value);
			}

			// Invalidate the secondary language if it's somehow set to the same
			if (value === getCookie(SettingNames.SecondaryLanguage)) {
				setCookie(SettingNames.SecondaryLanguage, 'none');
			}
		});
	},
	secondaryLanguage: () => {
		const isInSearchParam = get(page).url.searchParams.get(SettingNames.SecondaryLanguage);
		let existingValue = getCookie(SettingNames.SecondaryLanguage) as
			| keyof PokeapiLanguageCodes
			| undefined;

		if (isInSearchParam) {
			existingValue = isInSearchParam as keyof PokeapiLanguageCodes;
		} else {
			if (!existingValue) {
				setCookie(SettingNames.SecondaryLanguage, '');
			}
		}

		secondaryLanguage.set(existingValue as PokeapiLanguageCodes | undefined);

		secondaryLanguage.subscribe((value) => {
			window?.newrelic?.setCustomAttribute(SettingNames.SecondaryLanguage, value);

			const isInSearchParam = get(page).url.searchParams.get(SettingNames.SecondaryLanguage);

			if (!value || isInSearchParam) {
				return;
			}

			const existing = getCookie(SettingNames.SecondaryLanguage);
			if (!existing || value !== existing) {
				setCookie(SettingNames.SecondaryLanguage, value as PokeapiLanguageCodes);
			}
		});
	},
	versionSpecificPokemonSprites: () => {
		let existingValue = getCookie(SettingNames.VersionSpecificPokemonSprites) as string | undefined;
		if (existingValue === undefined || existingValue === null) {
			existingValue = 'true';
			setCookie(SettingNames.VersionSpecificPokemonSprites, existingValue);
		}

		versionSpecificPokemonSprites.set(existingValue === 'true' ? true : false);

		versionSpecificPokemonSprites.subscribe((value) => {
			window?.newrelic?.setCustomAttribute(SettingNames.VersionSpecificPokemonSprites, value);
			setCookie(SettingNames.VersionSpecificPokemonSprites, value.toString());
		});
	},
	versionSpecificTypeSprites: () => {
		let existingValue = getCookie(SettingNames.VersionSpecificTypeSprites) as string | undefined;
		if (existingValue === undefined || existingValue === null) {
			existingValue = 'true';
			setCookie(SettingNames.VersionSpecificTypeSprites, existingValue);
		}

		versionSpecificTypeSprites.set(existingValue === 'true' ? true : false);

		versionSpecificTypeSprites.subscribe((value) => {
			window?.newrelic?.setCustomAttribute(SettingNames.VersionSpecificTypeSprites, value);
			setCookie(SettingNames.VersionSpecificTypeSprites, value.toString());
		});
	},
	animateSprites: () => {
		let existingValue = getCookie(SettingNames.AnimateSprites) as string | undefined;
		if (existingValue === undefined) {
			existingValue = 'true';
			setCookie(SettingNames.AnimateSprites, existingValue);
		}

		animateSprites.set(existingValue === 'true' ? true : false);

		animateSprites.subscribe((value) => {
			window?.newrelic?.setCustomAttribute(SettingNames.AnimateSprites, value);
			setCookie(SettingNames.AnimateSprites, value.toString());
		});
	},
	user: () => {
		const cookieValue = getRawCookie(document.cookie, 'pb_auth');
		const rawData = cookieValue.replace('pb_auth=', '');
		const decodedString = decodeURIComponent(rawData);

		if (decodedString) {
			const authData = JSON.parse(decodedString) as {
				token: string;
				record: AuthRecord;
			};

			currentUser.set(authData.record);
		} else {
			currentUser.set(null);
		}
	},
	rememberToken: () => {
		let existingValue = getCookie('remember-token') as string | undefined;
		if (!existingValue) {
			existingValue = uuid();
			setCookie('remember-token', get(rememberToken));
		}
		rememberToken.set(existingValue);

		rememberToken.subscribe((value) => {
			window?.newrelic?.setUserId(value);
			window?.umami?.identify(value);

			if (!value) {
				return;
			}
			const existing = getCookie('remember-token');
			if (!existing || value !== existing) {
				setCookie('remember-token', value);
			}
		});
	}
};
