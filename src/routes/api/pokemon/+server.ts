import { logError } from '$lib/log';
import { lastPokedexEntry, pokeApiDomain } from '$lib/stores/domain';
import type { FlavorTextEntry, IPokemon, IPokemonSpecies, ISprites, Name } from '$lib/types/IPokemon';
import type { RequestHandler } from './$types';
import { findGameFromAPIGameName, findGameFromString } from '$lib/data/games';
import { capitaliseFirstLetter, pokemonVarietyNameToDisplay } from '$lib/utils/string';
import { fixAbilities, getPokemonTypesInGame, getTypeRelations } from '$lib/data/generationAdjuster';
import { formatEncounters, type IEncounterResponse } from '$lib/data/encounterFilter';
import { filterMovesetByVersionEntry } from '$lib/data/movesetFilter';
import { speciesNamesToNormalisedNames } from '$lib/utils/language';

const fetchCacheFirst = async(url: string | URL, cache: CacheStorage & {
	default: Cache;
} | undefined): Promise<Response> => {
	const req = new Request(url);

	const cacheResponse = await cache?.default.match(req);
	if (cacheResponse){
		return cacheResponse;
	}

	const res = await fetch(req);
	if (res.ok && cache){
		await cache.default.put(req, res);
	}
	return res;
}

const fetchPokemon = async (id: number, cache: CacheStorage & {
	default: Cache;
} | undefined): Promise<IPokemon> => {
	const res = await fetchCacheFirst(pokeApiDomain + '/pokemon/' + id, cache);
	if (!res.ok){
		throw new Error(`Non-200 status code when fetching /pokemon - ${res.status}`);
	}
	return await res.json() as IPokemon;
}

const fetchPokemonSpecies = async(id: number, cache: CacheStorage & {
	default: Cache;
} | undefined ): Promise<IPokemonSpecies> => {
	const res = await fetchCacheFirst(pokeApiDomain + '/pokemon-species/' + id, cache);
	if (!res.ok){
		throw new Error(`Non-200 status code when fetching /pokemon-species - ${res.status}`);
	}
	return await res.json() as IPokemonSpecies;
}

const fetchPokemonForm = async(url: string, cache: CacheStorage & {
	default: Cache;
} | undefined ): Promise<{sprites: ISprites;
	names: Name[]}> => {
	const res = await fetchCacheFirst(url, cache);
	if (!res.ok){
		throw new Error(`Non-200 status code when getting ${url} - ${res.status}`)
	}
	return await res.json() as { sprites: ISprites; names: Name[] };
}

const fetchPokemonEncounters = async(id: number, cache: CacheStorage & {
	default: Cache;
} | undefined ): Promise<IEncounterResponse[]> => {
	const res = await fetchCacheFirst(`${pokeApiDomain}/pokemon/${id}/encounters`, cache);
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
		fetchPokemon(id, platform?.caches),
		fetchPokemonSpecies(id, platform?.caches)
	])

	const gameEntry = findGameFromString(url.searchParams.get('game') ?? cookies.get('game'));
	const primaryLanguage = url.searchParams.get('primaryLanguage') ?? cookies.get('primaryLanguage') ?? 'en';
	const secondaryLanguage = url.searchParams.get('secondaryLanguage') ?? cookies.get('secondaryLanguage');
	const variety = url.searchParams.get('variety');

	const formEntry = pokemon.forms.find((entry) => entry.name === variety);
	if (formEntry) {
		try {
			const formData = await fetchPokemonForm(formEntry.url, platform?.caches);
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

	const varietyEntry = species.varieties.find((entry) => entry.pokemon.name === variety);

	if (varietyEntry) {
		try {
			const parts = varietyEntry.pokemon.url.split('/');
			const id = Number(parts[parts.length - 2]);
			let varietyPokemon = await fetchPokemon(id, platform?.caches);

			const nameParts = varietyPokemon.name.split('-');

			if (!nameParts) {
				throw new Error(`Tried to process an invalid variety of a Pokemon`);
			}

			const varietyForm = varietyPokemon.forms.find((a) => a.name === varietyPokemon.name);
			const varietyName = pokemonVarietyNameToDisplay(varietyPokemon.name);

			if (varietyForm) {
				const varietyFormPokemon = await fetchPokemonForm(varietyForm?.url, platform?.caches);
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

	const types = getPokemonTypesInGame(pokemon, gameEntry?.generation);

	const encounters = await fetchPokemonEncounters(id, platform?.caches);

	return new Response(JSON.stringify({
		id,
		pokemon: {
			...pokemon,
			abilities: fixAbilities(id, pokemon.past_abilities, pokemon.abilities, gameEntry),
			types,
			typeRelations: await getTypeRelations(gameEntry?.generation, types[0], types[1]),
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
			moves: filterMovesetByVersionEntry(pokemon.moves, gameEntry)
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
		encounters: formatEncounters(encounters, gameEntry)
	}), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
