import type { components } from '$/@types/api';
import type { MinimalTagPokemon } from '../types';

export function doesTagPokemonContainPokemon(
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
