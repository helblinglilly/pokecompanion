import type { Ability, Generation } from '$lib/types/IPokemon';
import { Generations, type IGameGroups } from './games';

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
