import { browser } from '$app/environment';
import { getRawCookie } from '$lib/utils/cookies';
import { writable } from 'svelte/store';
import { rememberToken } from './domain';

export type AuthRecord = {
	email: string;
	id: string;
	username: string;
	verified: boolean;
};

export const currentUser = writable<AuthRecord | null>();
currentUser.subscribe((value) => {
	if (!value) {
		return;
	}
	rememberToken.set(value.id);
});

export const syncCurrentUserFromAuthCookie = () => {
	if (!browser) {
		return;
	}

	const cookieValue = getRawCookie(document.cookie, 'pb_auth');
	const rawData = cookieValue.replace('pb_auth=', '');
	const decodedString = decodeURIComponent(rawData);

	if (!decodedString) {
		currentUser.set(null);
		return;
	}

	try {
		const authData = JSON.parse(decodedString) as {
			token: string;
			record: AuthRecord;
		};

		currentUser.set(authData.record);
	} catch {
		currentUser.set(null);
	}
};
