import type { IGame } from "$lib/data/games";

export interface Platform {
	context: {
		waitUntil(promise: Promise<unknown>): void;
	}
	caches: CacheStorage & { default: Cache }
}

export interface IUserPreferences {
	primaryLanguage: string;
	secondaryLanguage: string | undefined;
	selectedGame: IGame | undefined;
}