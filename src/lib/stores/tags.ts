import { writable } from 'svelte/store';
import { addNotification } from '../../features/notifications/notifications';
import type { IDisplayPokemon } from './pokemonPage';
import { Logger } from '$/debt/log';
import type { ITagMove } from '$/@types/api.pokecompanion';
import { PUBLIC_API_HOST } from '$env/static/public';
import type { paths } from '$/@types/api';
import type { APITag } from '$/features/tags/types';

export const tagStore = writable<APITag['tags']>([]);

export function doesTagContainPokemon(
	pokemon: IDisplayPokemon | undefined,
	tag: APITag['tags'][number]
) {
	if (!pokemon) {
		return false;
	}

	return tag.contents.pokemon?.some((a) => {
		return (
			a.id === pokemon.id &&
			(!pokemon.hasShinySprite || !a.shiny || a.shiny === pokemon.showShinySpriteIfExists) &&
			(!pokemon.gender || !a.gender || a.gender === pokemon.gender) &&
			((pokemon.variety?.includes('-default') && !a.variety) || pokemon.variety === a.variety)
		);
	});
}

export function doesTagContainMove(
	move: Omit<ITagMove, 'added'> | undefined,
	tag: APITag['tags'][number]
) {
	if (!move) {
		return false;
	}
	return tag.contents.move?.some((a) => {
		return a.id === move.id;
	});
}
