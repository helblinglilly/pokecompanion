import {
	fetchPokemon,
	fetchPokemonEncounters,
	fetchPokemonForm,
	fetchPokemonSpecies
} from '$/lib/server/cachedFetch/pokemon';
import { formatEncounters } from '$lib/data/encounterFilter';
import { formatMovesetToVersionEntries } from '$lib/data/movesetFilter';
import { Logger } from '$lib/log';
import { lastPokedexEntry } from '$lib/stores/domain';
import { speciesNamesToNormalisedNames } from '$lib/utils/language';
import { capitaliseFirstLetter, pokemonVarietyNameToDisplay } from '$lib/utils/string';
import type { RequestHandler } from '@sveltejs/kit';
import { parseUserPreferences } from '../../helpers';
import type { IPokemonRequestPreferences, IPokemonResponse } from '../types';

export const GET: RequestHandler = async ({ url, platform, cookies, params }) => {
	const id = Number(params.pokedex);
	if (!id) {
		return new Response(
			JSON.stringify({
				error: 'Missing pokemon in search params',
				searchParam: 'pokemon=:id'
			}),
			{
				status: 404,
				headers: {
					'content-type': 'application/json'
				}
			}
		);
	}

	if (id < 1 || id > lastPokedexEntry) {
		return new Response(
			JSON.stringify({
				error: 'Pokemon is outside of known range',
				knownPokemon: {
					from: 1,
					to: lastPokedexEntry
				},
				requested: id
			}),
			{
				status: 404,
				headers: {
					'content-type': 'application/json'
				}
			}
		);
	}

	const requestPreferences: IPokemonRequestPreferences = {
		...parseUserPreferences(url, cookies),
		variety: url.searchParams.get('variety'),
		shiny: url.searchParams.get('shiny') === 'true',
		isFemale: url.searchParams.get('gender') === 'female'
	};
	const { primaryLanguage, secondaryLanguage, variety } = requestPreferences;

	// Only some values may get rassigned
	// eslint-disable-next-line prefer-const
	let [pokemon, species, encounters] = await Promise.all([
		fetchPokemon(id, platform),
		fetchPokemonSpecies(id, platform),
		fetchPokemonEncounters(id, platform)
	]);

	if (!species.has_gender_differences && requestPreferences.isFemale) {
		requestPreferences.isFemale = false;
	}

	const formEntry = pokemon.forms.find((entry) => entry.name === variety);
	if (formEntry) {
		const formData = await fetchPokemonForm(formEntry.url, platform);
		species = {
			...species,
			names: formData.names
		};
	}

	const varietyEntry = species.varieties.find((entry) => entry.pokemon.name === variety);
	if (varietyEntry) {
		try {
			const parts = varietyEntry.pokemon.url.split('/');
			const id = Number(parts[parts.length - 2]);
			let varietyPokemon = await fetchPokemon(id, platform);

			const nameParts = varietyPokemon.name.split('-');

			if (!nameParts) {
				throw new Error(`Tried to process an invalid variety of a Pokemon`);
			}

			const varietyForm = varietyPokemon.forms.find((a) => a.name === varietyPokemon.name);
			const varietyName = pokemonVarietyNameToDisplay(varietyPokemon.name);

			if (varietyForm) {
				const varietyFormPokemon = await fetchPokemonForm(varietyForm?.url, platform);

				varietyPokemon = {
					...varietyPokemon,
					...varietyFormPokemon
				};

				if (
					varietyFormPokemon.names.length &&
					varietyFormPokemon.names.some(
						(varietyName) =>
							varietyName.language.name === primaryLanguage ||
							varietyName.language.name === secondaryLanguage
					)
				) {
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
			platform?.context.waitUntil(
				Logger.error(
					Logger.ErrorClasses.RuntimeError,
					new Error(`Something went wrong when trying to process Pokemon forms`),
					{
						context: 'Failed to parse Pokemon forms',
						pokemon: id,
						variety: varietyEntry.pokemon.name
					}
				)
			);
		}
	}

	// const easterEggData = easterEggs(id, variety);

	const response: IPokemonResponse = {
		id,

		pokemon: {
			...pokemon,
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
				),
			moves: formatMovesetToVersionEntries(pokemon.moves)
			// ...easterEggData?.pokemon
		},
		species: {
			...species,
			names: speciesNamesToNormalisedNames(species.names)
		},
		encounters: formatEncounters(encounters)
	};

	return new Response(JSON.stringify(response), {
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'public, max-age=86400'
		}
	});
};
