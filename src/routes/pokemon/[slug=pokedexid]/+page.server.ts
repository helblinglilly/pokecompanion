import { findGameFromString } from '$lib/data/games.js';
import { getPokemonTypesInGame, getTypeRelations } from '$lib/data/generationAdjuster.js';
import { pokeApiDomain } from '$lib/stores/domain';
import type { IPokemon, IPokemonSpecies } from '$lib/types/IPokemon';
import { speciesNamesToNormalisedNames } from '$lib/utils/language';
import { capitaliseFirstLetter } from '$lib/utils/string';

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

export const load = async ({ params, url, cookies }) => {
	const pokedexId = Number(params.slug);
	const gameEntry = findGameFromString(cookies.get('selectedGame'));

	// eslint-disable-next-line prefer-const
	let [pokemon, species] = await Promise.all([
		loadPokemon(pokedexId),
		loadPokemonSpecies(pokedexId)
	]);

	const varietyEntry = species.varieties.find(
		(entry) => entry.pokemon.name === url.searchParams.get('variety')
	);
	if (varietyEntry) {
		try {
			const parts = varietyEntry.pokemon.url.split('/');
			const id = Number(parts[parts.length - 2]);
			const varietyPokemon = await loadPokemon(id);

			const nameParts = varietyPokemon.name.split('-');
			varietyPokemon.name =
				capitaliseFirstLetter(nameParts[1]) + ' ' + capitaliseFirstLetter(nameParts[0]);

			pokemon = {
				...pokemon,
				...varietyPokemon
			};

			species.names = species.names.map((name) => {
				return {
					language: name.language,
					name: varietyPokemon.name
				};
			});
		} catch (err) {
			console.error(err);
		}
	}

	const types = getPokemonTypesInGame(pokemon, gameEntry?.generation);

	return {
		id: pokedexId,
		pokemon: { ...pokemon, types, typeRelations: await getTypeRelations(types[0], types[1]) },
		species: {
			...species,
			names: speciesNamesToNormalisedNames(species.names)
		}
	};
};
