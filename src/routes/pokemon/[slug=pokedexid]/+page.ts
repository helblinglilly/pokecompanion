import { pokeApiDomain } from '$lib/stores/domain';
import type { IPokemon, IPokemonSpecies } from '$lib/types/IPokemon';

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

export const load = async ({ params }) => {
	const pokedexId = Number(params.slug);

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
