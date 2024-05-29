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
import * as Sentry from '@sentry/browser';

export type UserPreferencePokemonVersion = PokeapiVersionGroups | 'generic' | undefined;

// TODO - Test this
export const cookieHandlers = {
	selectedGame: () => {
		const isInSearchParam = get(page).url.searchParams.get('game') as UserPreferencePokemonVersion;

		let existingValue = getCookie('selectedGame') as UserPreferencePokemonVersion;

		if (isInSearchParam) {
			existingValue = isInSearchParam;
		} else {
			if (!existingValue) {
				existingValue = 'generic';
				setCookie('selectedGame', existingValue);
			}
		}

		const foundGame = getGameGroupFromName(existingValue);
		selectedGame.set(foundGame);

		selectedGame.subscribe((value) => {
			Sentry.setTag('selectedGame', value?.pokeapi);
			window?.newrelic?.setCustomAttribute("selectedGame", value?.pokeapi);

			const isInSearchParam = get(page).url.searchParams.get('game');

			if (isInSearchParam) {
				return;
			}

			if (!value) {
				setCookie('selectedGame', 'generic');
				return;
			}

			const existingCookie = getCookie('selectedGame') as PokeapiVersionGroups | 'generic' | undefined;
			let existingValue = undefined;

			if (existingCookie){
				existingValue = getGameGroupFromName(existingCookie);
			}

			if (!existingValue || value.pokeapi !== existingValue.pokeapi) {
				setCookie('selectedGame', value.pokeapi);
			}
		});
	},
	primaryLanguage: () => {
		const isInSearchParam = get(page).url.searchParams.get('primaryLanguage');
		let existingValue = getCookie('primaryLanguage') as keyof Languages;

		if (isInSearchParam) {
			existingValue = isInSearchParam as keyof Languages;
		} else {
			if (!existingValue) {
				existingValue = 'en';
				setCookie('primaryLanguage', existingValue);
			}
		}

		primaryLanguage.set(existingValue);

		primaryLanguage.subscribe((value) => {
			Sentry.setTag('primaryLanguage', value);
			window?.newrelic?.setCustomAttribute("primaryLanguage", value);
			const isInSearchParam = get(page).url.searchParams.get('primaryLanguage');

			if (!value || isInSearchParam) {
				return;
			}
			const existing = getCookie('primaryLanguage');
			if (!existing || value !== existing) {
				setCookie('primaryLanguage', value);
			}

			// Invalidate the secondary language if it's somehow set to the same
			if (value === getCookie('secondaryLanguage')) {
				setCookie('secondaryLanguage', 'none');
			}
		});
	},
	secondaryLanguage: () => {
		const isInSearchParam = get(page).url.searchParams.get('secondaryLanguage');
		let existingValue = getCookie('secondaryLanguage') as keyof Languages | undefined;

		if (isInSearchParam) {
			existingValue = isInSearchParam as keyof Languages;
		} else {
			if (!existingValue) {
				existingValue = 'none';
				setCookie('secondaryLanguage', existingValue);
			}
		}

		secondaryLanguage.set(existingValue);

		secondaryLanguage.subscribe((value) => {
			Sentry.setTag('secondaryLanguage', value);
			window?.newrelic?.setCustomAttribute("secondaryLanguage", value);

			const isInSearchParam = get(page).url.searchParams.get('secondaryLanguage');

			if (!value || isInSearchParam) {
				return;
			}

			if (!value) {
				value = 'none';
			}
			const existing = getCookie('secondaryLanguage');
			if (!existing || value !== existing) {
				setCookie('secondaryLanguage', value);
			}
		});
	},
	versionSpecificPokemonSprites: () => {
		let existingValue = getCookie('versionSpecificPokemonSprites') as string | undefined;
		if (existingValue === undefined || null) {
			existingValue = 'true'
			setCookie('versionSpecificPokemonSprites', existingValue);
		}

		versionSpecificPokemonSprites.set(existingValue === 'true' ? true : false);

		versionSpecificPokemonSprites.subscribe((value) => {
			window?.newrelic?.setCustomAttribute("versionSpecificPokemonSprites", value);
			Sentry.setTag('versionSpecificPokemonSprites', value);
			setCookie('versionSpecificPokemonSprites', value.toString());
		});
	},
	versionSpecificTypeSprites: () => {
		let existingValue = getCookie('versionSpecificTypeSprites') as string | undefined;
		if (existingValue === undefined || null) {
			existingValue = 'true'
			setCookie('versionSpecificTypeSprites', existingValue);
		}

		versionSpecificPokemonSprites.set(existingValue === 'true' ? true : false);

		versionSpecificPokemonSprites.subscribe((value) => {
			window?.newrelic?.setCustomAttribute("versionSpecificTypeSprites", value);
			Sentry.setTag('versionSpecificTypeSprites', value);
			setCookie('versionSpecificTypeSprites', value.toString());
		});
	},
	animateSprites: () => {
		let existingValue = getCookie('animateSprites') as string | undefined;
		if (existingValue === undefined || null) {
			existingValue = 'true';
			setCookie('animateSprites', existingValue);
		}

		animateSprites.set(existingValue === 'true' ? true : false);

		animateSprites.subscribe((value) => {
			Sentry.setTag('animateSprites', value);
			window?.newrelic?.setCustomAttribute("animateSprites", value);
			setCookie('animateSprites', value.toString());
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
	}
};