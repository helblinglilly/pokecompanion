import { findGameFromString } from '$lib/data/games.js';
import {
	fixAbilities,
	getPokemonTypesInGame,
	getTypeRelations
} from '$lib/data/generationAdjuster.js';
import { pokeApiDomain } from '$lib/stores/domain';
import type { IPokemon, IPokemonSpecies, ISprites, Name } from '$lib/types/IPokemon';
import { speciesNamesToNormalisedNames } from '$lib/utils/language';
import { capitaliseFirstLetter, pokemonVarietyNameToDisplay } from '$lib/utils/string';

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

const loadPokemonForm = async (
	url: string
): Promise<{
	sprites: ISprites;
	names: Name[];
}> => {
	const response = await fetch(url);
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

	const requestedVariety = url.searchParams.get('variety');

	const formEntry = pokemon.forms.find((entry) => entry.name === requestedVariety);
	if (formEntry) {
		try {
			const formData = await loadPokemonForm(formEntry.url);
			pokemon = {
				...pokemon,
				sprites: formData.sprites
			};

			species = {
				...species,
				names: formData.names
			};
		} catch (err) {
			console.error(err);
		}
	}

	const varietyEntry = species.varieties.find((entry) => entry.pokemon.name === requestedVariety);

	if (varietyEntry) {
		try {
			const parts = varietyEntry.pokemon.url.split('/');
			const id = Number(parts[parts.length - 2]);
			let varietyPokemon = await loadPokemon(id);

			const nameParts = varietyPokemon.name.split('-');

			if (!nameParts) {
				throw new Error(`Tried to process an invalid variety of a Pokemon`);
			}

			const varietyForm = varietyPokemon.forms.find((a) => a.name === varietyPokemon.name);
			const varietyName = pokemonVarietyNameToDisplay(varietyPokemon.name);

			if (varietyForm) {
				const varietyFormPokemon = await loadPokemonForm(varietyForm?.url);
				const hasNewSprites = Object.keys(varietyFormPokemon.sprites).some((key) => {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore Literally iterating over the keys
					return varietyFormPokemon.sprites[key] !== null;
				});

				varietyPokemon = {
					...varietyPokemon,
					...varietyFormPokemon,
					sprites: hasNewSprites ? varietyFormPokemon.sprites : varietyPokemon.sprites
				};

				if (varietyFormPokemon.names.length) {
					species.names = varietyFormPokemon.names;
				} else {
					species.names = species.names.map((name) => {
						return {
							language: name.language,
							name: varietyName + ' ' + capitaliseFirstLetter(nameParts[0])
						};
					});
				}
			} else {
				species.names = species.names.map((name) => {
					return {
						language: name.language,
						name: varietyName + ' ' + capitaliseFirstLetter(nameParts[0])
					};
				});
			}

			pokemon = {
				...pokemon,
				...varietyPokemon
			};
		} catch (err) {
			console.error(err);
		}
	}

	const types = getPokemonTypesInGame(pokemon, gameEntry?.generation);

	return {
		id: pokedexId,
		pokemon: {
			...pokemon,
			abilities: fixAbilities(pokedexId, pokemon.past_abilities, pokemon.abilities, gameEntry),
			types,
			typeRelations: await getTypeRelations(types[0], types[1]),
			varietyForms: species.varieties
				.map((variety) => {
					return {
						name: variety.pokemon.name.includes('-')
							? variety.pokemon.name
							: variety.pokemon.name + '-default'
					};
				})
				.concat(pokemon.forms)
				.filter(
					(entry, index, arr) =>
						entry.name.includes('-') && arr.findIndex((e) => e.name === entry.name) === index
				)
		},
		species: {
			...species,
			names: speciesNamesToNormalisedNames(species.names)
		}
	};
};
