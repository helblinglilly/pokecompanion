import { lastPokedexEntry } from '$lib/stores/domain';
import { type FlavorTextEntry } from '$lib/types/IPokemon';
import type { RequestHandler } from '../$types';
import { findGameFromAPIGameName } from '$lib/data/games';
import { capitaliseFirstLetter, pokemonVarietyNameToDisplay } from '$lib/utils/string';
import { fixAbilities, getPokemonTypesInGame, getTypeRelations } from '$lib/data/generationAdjuster';
import { formatEncounters } from '$lib/data/encounterFilter';
import { filterMovesetByVersionEntry } from '$lib/data/movesetFilter';
import { speciesNamesToNormalisedNames } from '$lib/utils/language';
import { parseUserPreferences } from '../../helpers';
import type { IPokemonResponse } from './../types';
import { Logger } from '$lib/log';
import { fetchPokemon, fetchPokemonEncounters, fetchPokemonForm, fetchPokemonSpecies } from '../cachedFetch';

const filterPokedexEntries = (
	allEntries: FlavorTextEntry[],
	primaryLang: string | undefined,
	secondaryLang: string | undefined
) => {
	const hasMatchingLanguageEntries = allEntries.some(
		(entry) => entry.language.name === primaryLang || entry.language.name === secondaryLang
	);

	return allEntries
		.filter((entry) => {
			if (!hasMatchingLanguageEntries) {
				return true;
			}
			return entry.language.name === primaryLang || entry.language.name === secondaryLang;
		})
		.map((entry) => {
			return {
				language: entry.language.name,
				game: findGameFromAPIGameName(entry.version.name)?.shortName ?? 'Not found',
				// eslint-disable-next-line no-control-regex
				textEntry: entry.flavor_text.replace(/\n|\u000c/g, ' ')
			};
		});
	// To do: Move the selected game entry to the top
};

export const GET: RequestHandler = async ({ url, platform, cookies, params }) => {	
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore Fails to understand that pokedex param exists
	const rawId = params.pokedex;
	if (!rawId){
		return new Response(JSON.stringify({
			error: 'Missing pokemon in search params',
			searchParam: 'pokemon=:id'
		}), {
			status: 404,
			headers: {
				'content-type': 'application/json'
			}
		})
	}
	
	const id = parseInt(rawId, 10);
	if (isNaN(id)) {
		return new Response(JSON.stringify({
			error: 'Provided pokemon value is not a number',
			requested: id
		}), {
			status: 404,
			headers: {
				'content-type': 'application/json'
			}
		})
	}

	if (id < 1 || id > lastPokedexEntry){
		return new Response(JSON.stringify({
			error: 'Pokemon is outside of known range',
			knownPokemon: {
				from: 1,
				to: lastPokedexEntry
			},
			requested: id
		}), {
			status: 404,
			headers: {
				'content-type': 'application/json'
			}
		})
	}
	
	let [pokemon, species] = await Promise.all([
		fetchPokemon(id, platform),
		fetchPokemonSpecies(id, platform)
	])
	const { primaryLanguage, secondaryLanguage, selectedGame, variety} = {
		...parseUserPreferences(url, cookies),
		variety: url.searchParams.get('variety')
	}

	const formEntry = pokemon.forms.find((entry) => entry.name === variety);
	if (formEntry) {
		const formData = await fetchPokemonForm(formEntry.url, platform);
		pokemon = {
			...pokemon,
			sprites: formData.sprites
		};

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
			)
		}
	}

	const types = getPokemonTypesInGame(pokemon, selectedGame?.generation);

	const encounters = await fetchPokemonEncounters(id, platform);

	const response: IPokemonResponse = {
		id,
		pokemon: {
			...pokemon,
			abilities: fixAbilities(id, pokemon.past_abilities, pokemon.abilities, selectedGame),
			types,
			typeRelations: await getTypeRelations(selectedGame?.generation, types[0], types[1]),
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
			moves: filterMovesetByVersionEntry(pokemon.moves, selectedGame)
		},
		species: {
			...species,
			names: speciesNamesToNormalisedNames(species.names),
			flavor_text_entries: filterPokedexEntries(
				species.flavor_text_entries,
				primaryLanguage,
				secondaryLanguage
			)
		},
		encounters: formatEncounters(encounters, selectedGame)
	}
	return new Response(JSON.stringify(response), {
		headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=86400',
        },
	});
};
