import type { IType } from '$lib/stores/pokemonPage';
import type { Ability, Generation, IPokemon } from '$lib/types/IPokemon';
import { Generations, type IGameGroups, type IGeneration } from './games';

export const getPokemonTypesInGame = (pokemon: IPokemon, generation?: IGeneration): IType[] => {
	const vanillaTypes = pokemon.types.map((typeEntry) => {
		return {
			name: typeEntry.type.name,
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
						url: type.type.url
					};
				});
			}
		})
		.flat()
		.filter((a) => a !== undefined) as {
		name: string;
		url: string;
	}[];

	return pastTypes.length > 0 ? pastTypes : vanillaTypes;
};

export const addImageToType = (type: IType) => {
	return {
		name: type.name,
		url: type.url
	};
};

interface ITypeResponse {
	damage_relations: {
		half_damage_from: {
			name: string;
		}[];
		no_damage_from: {
			name: string;
		}[];
		double_damage_from: {
			name: string;
		}[];
	};
}

export interface ITypeRelations {
	resists: ITypeDetails[];
	weakAgainst: ITypeDetails[];
}

interface ITypeDetails {
	name: string;
	url: string;
	multiplier: number;
}

export const fixAbilities = (
	pastAbilities: {
		abilities: Ability[];
		generation: Generation;
	}[],
	abilities: Ability[],
	game: IGameGroups | undefined
) => {
	if (!game) {
		return abilities;
	}

	const selectedGenerationEntry = Generations.find(
		(a) => a.pokeApiName === game.generation.pokeApiName
	);
	const selectedGeneration = selectedGenerationEntry
		? Generations.indexOf(selectedGenerationEntry) + 1
		: Number.MAX_SAFE_INTEGER;

	const abilityOverrides = pastAbilities
		.filter((past) => {
			const pastGeneration = Generations.find((a) => a.pokeApiName === past.generation.name);
			const pastGenerationIndex = pastGeneration ? Generations.indexOf(pastGeneration) + 1 : -1;
			return selectedGeneration <= pastGenerationIndex;
		})
		.map((a) => a.abilities)
		.flat();

	const merged = abilities.map((ability) => {
		const overriddenEntry = abilityOverrides.filter((a) => a.slot === ability.slot);

		if (overriddenEntry.length === 0) {
			return ability;
		}

		return overriddenEntry[0];
	});

	return merged.filter((entry) => {
		if (entry === undefined) {
			return false;
		}
		if (entry?.ability === null) {
			return false;
		}
		return true;
	});
};
