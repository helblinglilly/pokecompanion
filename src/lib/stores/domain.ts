import { writable } from 'svelte/store';
import { getCookie, setCookie } from '../utils/cookies';
import type { Languages } from '../utils/language';
import PokemonNames from '$lib/data/pokemonNames.json';

export const theme = writable<'dark' | 'light' | undefined>();
export const selectedGame = writable<string | undefined>();
export const primaryLanguage = writable<keyof Languages>('en');
export const secondaryLanguage = writable<keyof Languages | undefined>();
export const versionSpecificSprites = writable<boolean>(true);
export const animateSprites = writable<boolean>(true);
export const pokeApiDomain = 'https://pokeapi.co/api/v2';
export const lastPokedexEntry = PokemonNames[PokemonNames.length - 1].id;
export const maxSearchResults = 15;
export const pokemonPageSize = 50;

// TODO - Test this
export const cookieHandlers = {
	selectedGame: () => {
		let existingValue = getCookie('selectedGame');
		if (!existingValue) {
			existingValue = 'generic';
			setCookie('selectedGame', existingValue);
		}
		selectedGame.set(existingValue);

		selectedGame.subscribe((value) => {
			if (!value) {
				return;
			}
			const existing = getCookie('selectedGame');
			if (!existing || value !== existing) {
				setCookie('selectedGame', value);
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
	}
};
