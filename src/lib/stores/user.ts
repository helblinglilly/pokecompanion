import { writable } from 'svelte/store';
import { rememberToken } from './domain';

export interface SignedInUser {
	id: string;
	username: string;
	email: string;
	name: string;
	avatar: string | undefined;
	verified: boolean;
}

export const currentUser = writable<SignedInUser | null>();
currentUser.subscribe((value) => {
	if (!value) {
		return;
	}
	rememberToken.set(value.id);
});
