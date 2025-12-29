import type { components } from '$/@types/api';
import type { MinimalTagEntity, MinimalTagMove, MinimalTagPokemon } from '../types';

export function doesTagContainEntry(
	tag: components['schemas']['TagContents'],
	entity: MinimalTagEntity
) {
	if (entity.pokemon) {
		return doesTagPokemonContainPokemon(tag.pokemon, entity.pokemon);
	}
	if (entity.move) {
		return doesTagMoveContainMove(tag.move, entity.move);
	}
	return false;
}

function doesTagPokemonContainPokemon(
	tag: components['schemas']['TagContents']['pokemon'],
	pokemon: MinimalTagPokemon | undefined
) {
	if (tag === undefined) {
		return false;
	}

	if (!pokemon) {
		return false;
	}

	return tag.some((tag) => {
		if (tag.id !== pokemon.id) {
			return false;
		}

		// tag.variety will be [pokemon-name]-default
		if (!!pokemon.variety) {
			if (tag.variety !== pokemon.variety) {
				return false;
			}
		}

		if (!!tag.shiny !== !!pokemon.shiny) {
			return false;
		}

		return true;
	});
}

function doesTagMoveContainMove(
	tag: components['schemas']['TagContents']['move'],
	move: MinimalTagMove | undefined
) {
	if (tag === undefined) {
		return false;
	}

	if (!move) {
		return false;
	}

	return tag.some((tag) => {
		return tag.id === move.id;
	});
}
