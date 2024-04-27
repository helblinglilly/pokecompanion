import type { IGame, IGameGroups } from '$lib/data/games';
import type { ISpriteImage } from '$lib/pokemon-id/sprites';
import { writable } from 'svelte/store';

export interface IType {
	name: string;
	icon: string;
	url: string;
}

export interface IDisplayPokemon {
	id: number;
	primarySprite: ISpriteImage;
	secondarySprite: ISpriteImage;

	hasFemaleSprite: boolean;
	showFemaleSpriteIfExists: boolean;

	hasShinySprite: boolean;
	showShinySpriteIfExists: boolean;

	gender: 'male' | 'female' | undefined;

	variety:
		| {
				spriteId: string | null;
				name: string | null;
		  }
		| undefined;
}

export const pokemonDisplayStore = writable<IDisplayPokemon>();

export interface IEncounterPokemon {
	games: IGameGroups[];
	selectedGame: IGame | undefined;
	selectedGameGroup: IGame[] | undefined;
}
