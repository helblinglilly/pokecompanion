import { writable } from 'svelte/store';

export interface SignedInUser {
	id: string;
	username: string;
	email: string;
	name: string;
	avatar: string | undefined;
}

export const currentUser = writable<SignedInUser | null>();
