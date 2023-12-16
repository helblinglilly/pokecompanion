import type { ISpriteImage } from '$lib/pokemon-id/sprites';
import { writable } from 'svelte/store';

export interface IDisplayPokemon {
	id: number;
	primarySprite: ISpriteImage;
	secondarySprite: ISpriteImage;

	hasFemaleSprite: boolean;
	showFemaleSpriteIfExists: boolean;

	hasShinySprite: boolean;
	showShinySpriteIfExists: boolean;

	gender: 'male' | 'female' | undefined;
}

export const pokemonDisplayStore = writable<IDisplayPokemon>();
