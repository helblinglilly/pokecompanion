import { writable } from 'svelte/store';

export const theme = writable<'dark' | 'light' | undefined>();
export const selectedGame = writable<string | undefined>();
