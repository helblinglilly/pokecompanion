import type { IPokemon, IPokemonSpecies } from '$lib/apiTypes';
import { pokeApiDomain } from '$lib/domain';

export const load = async ({ params }) => {
	const id = Number(params.slug);
	const [pokemon, species] = await Promise.all([loadPokemon(id), loadPokemonSpecies(id)]);

	return {
		slug: params.slug,
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
