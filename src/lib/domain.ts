import { writable } from 'svelte/store';
import { getCookie, setCookie } from './utils/cookies';

export const theme = writable<'dark' | 'light' | undefined>();
export const selectedGame = writable<string | undefined>();
export const primaryLanguage = writable<string>('en');
export const secondaryLanguage = writable<string | undefined>();

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
		let existingValue = getCookie('primaryLanguage');
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
		let existingValue = getCookie('secondaryLanguage');
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
	}
};
