import type { IGameGroups } from "$lib/data/games";

export interface Platform {
	context: {
		waitUntil(promise: Promise<unknown>): void;
	}
	caches: CacheStorage & { default: Cache }
}

export interface IUserPreferences {
	primaryLanguage: string;
	secondaryLanguage: string | undefined;
	selectedGame: IGameGroups | undefined;
	animateSprites: boolean;
}