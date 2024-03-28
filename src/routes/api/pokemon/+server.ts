import { logError, logToAxiom } from '$lib/log';
import { lastPokedexEntry, pokeApiDomain } from '$lib/stores/domain';
import { emptySprites, type FlavorTextEntry, type IPokemon, type IPokemonSpecies, type ISprites, type Name } from '$lib/types/IPokemon';
import type { RequestHandler } from './$types';
import { findGameFromAPIGameName } from '$lib/data/games';
import { capitaliseFirstLetter, pokemonVarietyNameToDisplay } from '$lib/utils/string';
import { fixAbilities, getPokemonTypesInGame, getTypeRelations } from '$lib/data/generationAdjuster';
import { formatEncounters, type IEncounterResponse } from '$lib/data/encounterFilter';
import { filterMovesetByVersionEntry } from '$lib/data/movesetFilter';
import { speciesNamesToNormalisedNames } from '$lib/utils/language';
import { parseUserPreferences } from '../helpers';

interface Platform {
	context: {
		waitUntil(promise: Promise<unknown>): void;
	}
	caches: CacheStorage & { default: Cache }
}

const fetchCacheFirst = async(url: string | URL, platform: Readonly<Platform> | undefined): Promise<Response> => {
	const parsedUrl = new URL(url);
	const req = new Request(parsedUrl);

	if (platform?.caches?.default){
		try {
			const cacheResponse = await platform.caches.default.match(parsedUrl.pathname);
			if (cacheResponse){
				return cacheResponse;
			}
		} catch(err){
			logToAxiom({
				message: 'Failed to access cache',
				error: err
			})
		}
	}

	const res = await fetch(req);
	if (res.ok && platform?.caches?.default){
		try {
			const responseToCache = res.clone();
            platform.context.waitUntil(
                platform.caches.default.put(parsedUrl.pathname, responseToCache)
            );
		} catch(err){
			logToAxiom({
				message: 'Failed to put to cache',
				error: err
			})
		}
	}
	return res;
}

const fetchPokemon = async (id: number, platform: Platform | undefined): Promise<IPokemon> => {
	const res = await fetchCacheFirst(pokeApiDomain + '/pokemon/' + id, platform);
	if (!res.ok){
		throw new Error(`Non-200 status code when fetching /pokemon - ${res.status}`);
	}
	return await res.json() as IPokemon;
}

const fetchPokemonSpecies = async(id: number, platform: Platform | undefined): Promise<IPokemonSpecies> => {
	const res = await fetchCacheFirst(pokeApiDomain + '/pokemon-species/' + id, platform);
	if (!res.ok){
		throw new Error(`Non-200 status code when fetching /pokemon-species - ${res.status}`);
	}
	return await res.json() as IPokemonSpecies;
}

const fetchPokemonForm = async(url: string, platform: Platform | undefined): Promise<{sprites: ISprites;
	names: Name[]}> => {
	const res = await fetchCacheFirst(url, platform);

	const returnEmptyResponse = () => {
		let id: number;
		try{
			const potentialId = url.split('/')[6];
			id = Number(potentialId);
		} catch {
			id = -1;
		}
		return {
			sprites: emptySprites(id),
			names: []
		}
	}

	if (!res.ok){
		logError('Failed to fetch Pokemon form', 'PokemonFormError', {
			url: url,
			status: res.status
		});
		return returnEmptyResponse();
	}

	try {
		const body = await res.json() as { sprites: ISprites; names: Name[] };
		return body;
	} catch(err){
		logError('Failed to parse response body', 'PokemonFormError', {
			url: url,
			status: res.status,
			error: err
		});
		return returnEmptyResponse();
	}
}

const fetchPokemonEncounters = async(id: number, platform: Platform | undefined): Promise<IEncounterResponse[]> => {
	const res = await fetchCacheFirst(`${pokeApiDomain}/pokemon/${id}/encounters`, platform);
	if (!res.ok){
		logError(`Non-200 status code when fetching /pokemon/${id}/encounters - ${res.status}`, 'PokemonEncounterLoadFailed', {
			requestUrl: `/pokemon/${id}/encounters`,
			requestError: res.statusText
		})
		return [];		
	}
	return await res.json() as IEncounterResponse[];
}

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

export const GET: RequestHandler = async ({ url, platform, cookies }) => {
	const rawId = url.searchParams.get('pokemon');
	if (!rawId){
		return new Response('Missing pokemon in search param', {
			status: 404
		})
	} 
	
	const id = parseInt(rawId, 10);
	if (isNaN(id)) {
		return new Response('Pokemon provided is not a number', {
			status: 404
		})
	}

	if (id < 1 || id >= lastPokedexEntry){
		return new Response('Pokemon is outside of known range', {
			status: 404
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
			logError('Something went wrong when trying to process forms', 'PokemonFormError', {
				err,
				...varietyEntry
			});
		}
	}

	const types = getPokemonTypesInGame(pokemon, selectedGame?.generation);

	const encounters = await fetchPokemonEncounters(id, platform);

	return new Response(JSON.stringify({
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
	}), {
		headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=86400',
        },
	});
};
