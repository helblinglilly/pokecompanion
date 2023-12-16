import type { IType } from '$lib/stores/pokemonPageStore';
import type { IPokemon } from '$lib/types/IPokemon';
import { Generations, type IGeneration } from './games';

export const getPokemonTypesInGame = (pokemon: IPokemon, generation?: IGeneration): IType[] => {
	const vanillaTypes = pokemon.types.map((typeEntry) => {
		return {
			name: typeEntry.type.name,
			icon: `/icons/types/${typeEntry.type.name}.webp`,
			url: typeEntry.type.url
		};
	});

	if (pokemon.past_types.length === 0 || !generation) {
		return vanillaTypes;
	}

	const currentGenIndex = Generations.findIndex((gen) => {
		return gen.pokeApiName === generation.pokeApiName;
	});

	const pastTypes = pokemon.past_types
		.map((pastType) => {
			const genIndex = Generations.findIndex((gen) => {
				return gen.pokeApiName === pastType.generation.name;
			});

			if (currentGenIndex <= genIndex) {
				return pastType.types.map((type) => {
					return {
						name: type.type.name,
						icon: `/icons/types/${type.type.name}.webp`,
						url: type.type.url
					};
				});
			}
		})
		.flat()
		.filter((a) => a !== undefined) as {
		name: string;
		icon: string;
		url: string;
	}[];

	return pastTypes.length > 0 ? pastTypes : vanillaTypes;
};

export const addImageToType = (type: IType) => {
	return {
		name: type.name,
		icon: `/icons/types/${type.name}.webp`,
		url: type.url
	};
};
