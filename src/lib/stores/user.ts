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
