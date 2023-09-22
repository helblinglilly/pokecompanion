import type { IPokemon, IPokemonSpecies } from '$lib/types/IPokemon';
import { pokeApiDomain } from '$lib/domain';

export const getPokemonPageData = async (pokedexId: number) => {
	const [pokemon, species] = await Promise.all([
		loadPokemon(pokedexId),
		loadPokemonSpecies(pokedexId)
	]);

	return {
		id: pokedexId,
		pokemon: { ...pokemon },
		species: { ...species }
	};
};

const loadPokemon = async (id: number): Promise<IPokemon> => {
	const response = await fetch(pokeApiDomain + `/pokemon/${id}`);
	const body = await response.json();
	return body;
};

const loadPokemonSpecies = async (id: number): Promise<IPokemonSpecies> => {
	const response = await fetch(pokeApiDomain + `/pokemon-species/${id}`);
	const body = await response.json();
	return body;
};
