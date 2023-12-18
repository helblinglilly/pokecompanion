import { writable } from 'svelte/store';
import { getCookie, getRawCookie, setCookie } from '../utils/cookies';
import type { Languages } from '../utils/language';
import PokemonNames from '$lib/data/pokemonNames.json';
import Pocketbase from 'pocketbase';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { currentUser, type SignedInUser } from './user';
import { findGameFromString, type IGame } from '$lib/data/games';

export const theme = writable<'dark' | 'light' | undefined>();
export const selectedGame = writable<IGame | undefined>();
export const primaryLanguage = writable<keyof Languages>('en');
export const secondaryLanguage = writable<keyof Languages | undefined>();
export const versionSpecificSprites = writable<boolean>(true);
export const animateSprites = writable<boolean>(true);
export const pokeApiDomain = 'https://pokeapi.co/api/v2';
export const lastPokedexEntry = PokemonNames[PokemonNames.length - 1].id;
export const maxSearchResults = 15;
export const pokemonPageSize = 50;
export const pb = writable(new Pocketbase(PUBLIC_POCKETBASE_URL));

function generateUUID() {
	if (!window.crypto) {
		console.error('crypto API not available');
		return null;
	}

	const array = new Uint32Array(4);
	window.crypto.getRandomValues(array);

	// RFC4122 requires certain bits to be set
	array[2] = (array[2] & 0xffff0fff) | 0x4000; // set bits 12-15 to 0100
	array[3] = (array[3] & 0x3fffffff) | 0x80000000; // set bits 30-31 to 10

	return (
		array[0].toString(16).padStart(4, '0') +
		array[1].toString(16).padStart(4, '0') +
		array[2].toString(16).padStart(4, '0') +
		array[3].toString(16).padStart(4, '0')
	);
}

// TODO - Test this
export const cookieHandlers = {
	selectedGame: () => {
		let existingValue = getCookie('selectedGame');
		if (!existingValue) {
			existingValue = 'generic';
			setCookie('selectedGame', existingValue);
		}

		const foundGame = findGameFromString(existingValue);
		selectedGame.set(foundGame);

		selectedGame.subscribe((value) => {
			if (!value) {
				setCookie('selectedGame', 'generic');
				return;
			}

			const existingCookie = getCookie('selectedGame');
			const existingValue = findGameFromString(existingCookie || '');
			if (!existingValue || value.cookieGroup !== existingValue.cookieGroup) {
				setCookie('selectedGame', value.cookieGroup);
			}
		});
	},
	primaryLanguage: () => {
		let existingValue = getCookie('primaryLanguage') as keyof Languages;
		if (!existingValue) {
			existingValue = 'en';
			setCookie('primaryLanguage', existingValue);
		}
		primaryLanguage.set(existingValue);

		primaryLanguage.subscribe((value) => {
			if (!value) {
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
		let existingValue = getCookie('secondaryLanguage') as keyof Languages | undefined;
		if (!existingValue) {
			existingValue = 'none';
			setCookie('secondaryLanguage', existingValue);
		}

		secondaryLanguage.set(existingValue);

		secondaryLanguage.subscribe((value) => {
			if (!value) {
				value = 'none';
			}
			const existing = getCookie('secondaryLanguage');
			if (!existing || value !== existing) {
				setCookie('secondaryLanguage', value);
			}
		});
	},
	versionSpecificSprites: () => {
		let existingValue = getCookie('versionSpecificSprites') as boolean | undefined;
		if (existingValue === undefined || null) {
			existingValue = true;
			setCookie('versionSpecificSprites', existingValue.toString());
		}

		versionSpecificSprites.set(existingValue);

		versionSpecificSprites.subscribe((value) => {
			setCookie('versionSpecificSprites', value.toString());
		});
	},
	animateSprites: () => {
		let existingValue = getCookie('animateSprites') as boolean | undefined;
		if (existingValue === undefined || null) {
			existingValue = true;
			setCookie('animateSprites', existingValue.toString());
		}

		animateSprites.set(existingValue);

		animateSprites.subscribe((value) => {
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
		const freshUUId = generateUUID() ?? 'not able to generate';

		if (!existingValue || existingValue === 'not able to generate') {
			existingValue = 'none';
			setCookie('remember-token', freshUUId);
		}

		currentUser.subscribe((value) => {
			if (value) {
				setCookie('remember-token', value.id);
			}
		});
	}
};
