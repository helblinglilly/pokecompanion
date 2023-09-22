import type { IPokemon } from '$lib/types/IPokemon';
import type { IGeneration } from './games';

interface IType {
	name: string;
	icon: string;
}

export const getPokemonTypesInGame = (pokemon: IPokemon, generation?: IGeneration): IType[] => {
	if (pokemon.past_types.length === 0) {
		return pokemon.types.map((typeEntry) => {
			return {
				name: typeEntry.type.name,
				icon: `/icons/types/${typeEntry.type.name}.webp`
			};
		});
	}

	// Need to add logic for the whole generational differences
	return [];
};
