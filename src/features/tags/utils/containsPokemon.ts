import type { components } from '$/@types/api';
import type { MinimalTagPokemon } from '../types';

export function doesTagContainPokemon(
	tag: components['schemas']['TagContents']['pokemon'],
	pokemon: MinimalTagPokemon
) {
	if (!tag) {
		return false;
	}

	return tag.some((tag) => {
		return (
			tag.id === pokemon.id && tag.variety === pokemon.variety && tag.shiny === pokemon.shiny
			// tag.gender === pokemon.gender
		);
	});
}
