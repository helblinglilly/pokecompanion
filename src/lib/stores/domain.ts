import { get, writable } from 'svelte/store';
import { getCookie, getRawCookie, setCookie } from '../utils/cookies';
import type { Languages } from '../utils/language';
import { currentUser, type AuthRecord } from './user';
import { getGameGroupFromName, type IGameGroups } from '$lib/data/games';
import { v4 as uuid } from 'uuid';
import { page } from '$app/stores';
import type { PokeapiVersionGroups } from '$/@types/api.pokecompanion';
import type { paths } from '$/@types/api';
import { invalidateAll } from '$app/navigation';

export const theme = writable<'dark' | 'light' | undefined>();
export const selectedGame = writable<IGameGroups | undefined>();
export const primaryLanguage = writable<keyof Languages>('en');
export const secondaryLanguage = writable<keyof Languages | undefined>();
export const versionSpecificPokemonSprites = writable<boolean>(true);
export const versionSpecificTypeSprites = writable<boolean>(false);
export const animateSprites = writable<boolean>(true);
export const rememberToken = writable<string>(uuid());
export const homepageMessaging = writable<string>('');
export const meta = writable<
	paths['/meta']['get']['responses']['200']['content']['application/json']
>({
	lastPokedexEntry: 1,
	games: [],
	languages: []
});
export const pokeApiDomain = 'https://pokeapi.co/api/v2';
export const maxSearchResults = 15;
export const pokemonPageSize = 50;

export const defaultFeatureFlags: FeatureFlags = {};
export const featureFlags = writable<FeatureFlags>(defaultFeatureFlags);

export enum SettingNames {
	SelectedGame = 'selectedGame',
	PrimaryLanguage = 'primaryLanguage',
	SecondaryLanguage = 'secondaryLanguage',
	VersionSpecificPokemonSprites = 'versionSpecificPokemonSprites',
	VersionSpecificTypeSprites = 'versionSpecificTypeSprites',
	AnimateSprites = 'animateSprites'
}

export type FeatureFlags = {};

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

		const foundGame = getGameGroupFromName(existingValue);
		selectedGame.set(foundGame);

		selectedGame.subscribe((value) => {
			invalidateAll();
			window?.newrelic?.setCustomAttribute(SettingNames.SelectedGame, value?.pokeapi);

			const isInSearchParam = get(page).url.searchParams.get('game');

			if (isInSearchParam) {
				return;
			}

			if (!value) {
				setCookie(SettingNames.SelectedGame, 'generic');
				return;
			}

			const existingCookie = getCookie(SettingNames.SelectedGame) as
				| PokeapiVersionGroups
				| undefined;
			let existingValue = undefined;

			if (existingCookie) {
				existingValue = getGameGroupFromName(existingCookie);
			}

			if (!existingValue || value.pokeapi !== existingValue.pokeapi) {
				setCookie(SettingNames.SelectedGame, value.pokeapi);
			}
		});
	},
	primaryLanguage: () => {
		const isInSearchParam = get(page).url.searchParams.get(SettingNames.PrimaryLanguage);
		let existingValue = getCookie(SettingNames.PrimaryLanguage) as keyof Languages;

		if (isInSearchParam) {
			existingValue = isInSearchParam as keyof Languages;
		} else {
			if (!existingValue) {
				existingValue = 'en';
				setCookie(SettingNames.PrimaryLanguage, existingValue);
			}
		}

		primaryLanguage.set(existingValue);

		primaryLanguage.subscribe((value) => {
			invalidateAll();
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
		let existingValue = getCookie(SettingNames.SecondaryLanguage) as keyof Languages | undefined;

		if (isInSearchParam) {
			existingValue = isInSearchParam as keyof Languages;
		} else {
			if (!existingValue) {
				existingValue = 'none';
				setCookie(SettingNames.SecondaryLanguage, existingValue);
			}
		}

		secondaryLanguage.set(existingValue);

		secondaryLanguage.subscribe((value) => {
			invalidateAll();
			window?.newrelic?.setCustomAttribute(SettingNames.SecondaryLanguage, value);

			const isInSearchParam = get(page).url.searchParams.get(SettingNames.SecondaryLanguage);

			if (!value || isInSearchParam) {
				return;
			}

			if (!value) {
				value = 'none';
			}
			const existing = getCookie(SettingNames.SecondaryLanguage);
			if (!existing || value !== existing) {
				setCookie(SettingNames.SecondaryLanguage, value);
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
			invalidateAll();
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
			invalidateAll();
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
			invalidateAll();
			window?.newrelic?.setCustomAttribute(SettingNames.AnimateSprites, value);
			setCookie(SettingNames.AnimateSprites, value.toString());
		});
	},
	user: () => {
		const cookieValue = getRawCookie(document.cookie, 'pb_auth');
		const rawData = cookieValue.replace('pb_auth=', '');
		const deocdedString = decodeURIComponent(rawData);
		const authData = JSON.parse(deocdedString) as {
			token: string;
			record: AuthRecord;
		};

		currentUser.set(authData.record);
	},
	rememberToken: () => {
		let existingValue = getCookie('remember-token') as string | undefined;
		if (!existingValue) {
			existingValue = uuid();
			setCookie('remember-token', get(rememberToken));
		}
		rememberToken.set(existingValue);

		rememberToken.subscribe((value) => {
			invalidateAll();
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
	},
	homepageMessaging: () => {
		let existingValue = getCookie('homepage-messaging') as string | undefined;
		if (!existingValue) {
			existingValue = 'new-visitor';
			setCookie('homepage-messaging', get(homepageMessaging));
		}
		homepageMessaging.set(existingValue);

		homepageMessaging.subscribe((value) => {
			if (!value) {
				return;
			}
			const existing = getCookie('homepage-messaging');
			if (!existing || value !== existing) {
				setCookie('homepage-messaging', value);
			}
		});
	},
	featureFlags: () => {
		let existingValue = getCookie('features') as string | undefined;

		if (!existingValue) {
			existingValue = JSON.stringify(defaultFeatureFlags);
		}
		setCookie('features', existingValue);
		featureFlags.set(JSON.parse(existingValue));

		featureFlags.subscribe((value) => {
			setCookie('features', JSON.stringify(value));
		});
	}
};
