import { writable } from 'svelte/store';
import { rememberToken } from './domain';
import type { AuthRecord } from 'pocketbase';

export const currentUser = writable<AuthRecord | null>();
currentUser.subscribe((value) => {
	if (!value) {
		return;
	}
	rememberToken.set(value.id);
});
