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

	const pokemonTypes = pastTypes.length > 0 ? pastTypes : vanillaTypes;

	// const typeRequests: Promise<Response>[] = [];
	// pokemonTypes.forEach((type) => {
	// 	typeRequests.push(fetch(type.url).then((response) => response.json()));
	// });

	return pokemonTypes;
};

export const addImageToType = (type: IType) => {
	return {
		name: type.name,
		icon: `/icons/types/${type.name}.webp`,
		url: type.url
	};
};

export const getTypeRelations = async (a: IType, b: IType | undefined) => {
	const [type1, type2] = await Promise.all([fetch(a.url), b ? fetch(b.url) : fetch(a.url)]);

	console.log(type1, type2);
	return 'hello';
};
