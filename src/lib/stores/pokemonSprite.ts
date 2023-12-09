import type { ISpriteData } from '$lib/pokemon-id/sprites';
import { writable } from 'svelte/store';

interface ISprites {
	primarySprite: ISpriteData;
	secondarySprite: ISpriteData;
}

export const pokemonSprite = writable<ISprites>();
