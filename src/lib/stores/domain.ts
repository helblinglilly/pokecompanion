import { get, writable } from 'svelte/store';
import { getCookie, getRawCookie, setCookie } from '../utils/cookies';
import type { Languages } from '../utils/language';
import PokemonNames from '$lib/data/pokemonNames.json';
import Pocketbase from 'pocketbase';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { currentUser, type SignedInUser } from './user';
import { getGameGroupFromName, PokeapiVersionGroups, type IGameGroups } from '$lib/data/games';
import { v4 as uuid } from 'uuid';
import { page } from '$app/stores';
import * as Sentry from '@sentry/browser';

export const theme = writable<'dark' | 'light' | undefined>();
export const selectedGame = writable<IGameGroups | undefined>();
export const primaryLanguage = writable<keyof Languages>('en');
export const secondaryLanguage = writable<keyof Languages | undefined>();
export const versionSpecificPokemonSprites = writable<boolean>(true);
export const versionSpecificTypeSprites = writable<boolean>(false);
export const animateSprites = writable<boolean>(true);
export const rememberToken = writable<string>(uuid());
export const homepageMessaging = writable<string>('');
export const pokeApiDomain = 'https://pokeapi.co/api/v2';
export const lastPokedexEntry =
	PokemonNames.findLast((entry) => {
		return entry.id < 10000;
	})?.id ?? 5000;
export const maxSearchResults = 15;
export const pokemonPageSize = 50;
export const pb = writable(new Pocketbase(PUBLIC_POCKETBASE_URL));

export const defaultFeatureFlags: FeatureFlags = {
	useTeams: false
}
export const featureFlags = writable<FeatureFlags>(defaultFeatureFlags)


export enum SettingNames { 
	SelectedGame = 'selectedGame',
	PrimaryLanguage = 'primaryLanguage',
	SecondaryLanguage= 'secondaryLanguage',
	VersionSpecificPokemonSprites = 'versionSpecificPokemonSprites',
	VersionSpecificTypeSprites = 'versionSpecificTypeSprites',
	AnimateSprites = 'animateSprites',
}

export type FeatureFlags = {
	useTeams: boolean;
}

export type UserPreferencePokemonVersion = PokeapiVersionGroups | 'generic' | undefined;

export const cookieHandlers = {
	selectedGame: () => {
		const isInSearchParam = get(page).url.searchParams.get('game') as UserPreferencePokemonVersion;

		let existingValue = getCookie(SettingNames.SelectedGame) as UserPreferencePokemonVersion;

		if (isInSearchParam) {
			existingValue = isInSearchParam;
		} else {
			if (!existingValue) {
				existingValue = PokeapiVersionGroups.SCARLET_VIOLET;
				setCookie(SettingNames.SelectedGame, existingValue);
			}
		}

		const foundGame = getGameGroupFromName(existingValue);
		selectedGame.set(foundGame);

		selectedGame.subscribe((value) => {
			Sentry.setTag(SettingNames.SelectedGame, value?.pokeapi);
			window?.newrelic?.setCustomAttribute(SettingNames.SelectedGame, value?.pokeapi);

			const isInSearchParam = get(page).url.searchParams.get('game');

			if (isInSearchParam) {
				return;
			}

			if (!value) {
				setCookie(SettingNames.SelectedGame, 'generic');
				return;
			}

			const existingCookie = getCookie(SettingNames.SelectedGame) as PokeapiVersionGroups | 'generic' | undefined;
			let existingValue = undefined;

			if (existingCookie){
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
			Sentry.setTag(SettingNames.PrimaryLanguage, value);
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
			Sentry.setTag(SettingNames.SecondaryLanguage, value);
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
			existingValue = 'true'
			setCookie(SettingNames.VersionSpecificPokemonSprites, existingValue);
		}

		versionSpecificPokemonSprites.set(existingValue === 'true' ? true : false);

		versionSpecificPokemonSprites.subscribe((value) => {
			window?.newrelic?.setCustomAttribute(SettingNames.VersionSpecificPokemonSprites, value);
			Sentry.setTag(SettingNames.VersionSpecificPokemonSprites, value);
			setCookie(SettingNames.VersionSpecificPokemonSprites, value.toString());
		});
	},
	versionSpecificTypeSprites: () => {
		let existingValue = getCookie(SettingNames.VersionSpecificTypeSprites) as string | undefined;
		if (existingValue === undefined || existingValue === null) {
			existingValue = 'true'
			setCookie(SettingNames.VersionSpecificTypeSprites, existingValue);
		}

		versionSpecificTypeSprites.set(existingValue === 'true' ? true : false);

		versionSpecificTypeSprites.subscribe((value) => {
			window?.newrelic?.setCustomAttribute(SettingNames.VersionSpecificTypeSprites, value);
			Sentry.setTag(SettingNames.VersionSpecificTypeSprites, value);
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
			Sentry.setTag(SettingNames.AnimateSprites, value);
			window?.newrelic?.setCustomAttribute(SettingNames.AnimateSprites, value);
			setCookie(SettingNames.AnimateSprites, value.toString());
		});
	},
	auth: () => {
		const authedPb = new Pocketbase(PUBLIC_POCKETBASE_URL);
		authedPb.authStore.loadFromCookie(getRawCookie(document.cookie, 'pb_auth') || '');
		currentUser.set(authedPb.authStore.model as SignedInUser);
		pb.set(authedPb);
	},
	rememberToken: () => {
		let existingValue = getCookie('remember-token') as string | undefined;
		if (!existingValue) {
			existingValue = uuid();
			setCookie('remember-token', get(rememberToken));
		}
		rememberToken.set(existingValue);

		rememberToken.subscribe((value) => {
			Sentry.setUser({
				id: value
			});
			window?.newrelic?.setUserId(value);

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

		if (!existingValue){
			existingValue = JSON.stringify(defaultFeatureFlags);
		}
		setCookie('features', existingValue)
		featureFlags.set(JSON.parse(existingValue));

		featureFlags.subscribe((value) => {
			setCookie('features', JSON.stringify(value));
		});
	}
};