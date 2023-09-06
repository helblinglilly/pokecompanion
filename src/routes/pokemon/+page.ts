import PokemonNames from '$lib/data/pokemonNames.json';
import type { Languages } from '$lib/utils/language';

export interface IPokemonNames {
	names: Languages[];
	id: number;
	generation: number;
}
export function load(): {
	gen1: IPokemonNames[];
	gen2: IPokemonNames[];
	gen3: IPokemonNames[];
	gen4: IPokemonNames[];
	gen5: IPokemonNames[];
	gen6: IPokemonNames[];
	gen7: IPokemonNames[];
	gen8: IPokemonNames[];
	gen9: IPokemonNames[];
} {
	return {
		gen1: PokemonNames.filter((a) => a.generation === 1).sort((a, b) => (a.id > b.id ? 1 : -1)),
		gen2: PokemonNames.filter((a) => a.generation === 2).sort((a, b) => (a.id > b.id ? 1 : -1)),
		gen3: PokemonNames.filter((a) => a.generation === 3).sort((a, b) => (a.id > b.id ? 1 : -1)),
		gen4: PokemonNames.filter((a) => a.generation === 4).sort((a, b) => (a.id > b.id ? 1 : -1)),
		gen5: PokemonNames.filter((a) => a.generation === 5).sort((a, b) => (a.id > b.id ? 1 : -1)),
		gen6: PokemonNames.filter((a) => a.generation === 6).sort((a, b) => (a.id > b.id ? 1 : -1)),
		gen7: PokemonNames.filter((a) => a.generation === 7).sort((a, b) => (a.id > b.id ? 1 : -1)),
		gen8: PokemonNames.filter((a) => a.generation === 8).sort((a, b) => (a.id > b.id ? 1 : -1)),
		gen9: PokemonNames.filter((a) => a.generation === 9).sort((a, b) => (a.id > b.id ? 1 : -1))
	};
}
