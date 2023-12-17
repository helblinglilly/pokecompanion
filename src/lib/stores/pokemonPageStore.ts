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
				spriteId: number | null;
				name: string | null;
		  }
		| undefined;
}

export const pokemonDisplayStore = writable<IDisplayPokemon>();
