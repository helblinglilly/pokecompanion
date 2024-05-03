import type { IEncounterResponse } from "$lib/data/encounterFilter";
import { Logger } from "$lib/log";
import { pokeApiDomain } from "$lib/stores/domain";
import { type IPokemon, type IPokemonSpecies, type ISprites, type Name, emptySprites } from "$lib/types/IPokemon";
import type { Platform } from "../types";

const isCachingEnabled = false;

export const fetchCacheFirst = async(url: string | URL, platform: Readonly<Platform> | undefined): Promise<Response> => {
	const parsedUrl = new URL(url);
	const req = new Request(parsedUrl);

	if (platform?.caches?.default && isCachingEnabled){
		try {
			const cacheResponse = await platform.caches.default.match(url);
			if (cacheResponse){
				return cacheResponse;
			}
		} catch(err){			
			platform.context.waitUntil(
				Logger.warn(
					'Tried to read request from cache, but threw an error',
					{
						request: url,
						error: Logger.buildError(err).message
					}
				)
			)
		}
	}

	const res = await fetch(req);
	if (res.ok && platform?.caches?.default && isCachingEnabled){
		try {
			const responseToCache = res.clone();
            platform.context.waitUntil(
                platform.caches.default.put(url, responseToCache)
            );
		} catch(err){
			platform.context.waitUntil(
				Logger.warn(
					'Failed to place successful request in cache',
					{
						request: url,
						error: Logger.buildError(err).message
					}
				)
			)
		}
	}
	return res;
}

export const fetchPokemon = async (id: number, platform: Platform | undefined): Promise<IPokemon> => {
	const res = await fetchCacheFirst(pokeApiDomain + '/pokemon/' + id, platform);
	if (!res.ok){
		throw new Error(`Non-200 status code when fetching /pokemon - ${res.status}`);
	}
	return await res.json() as IPokemon;
}

export const fetchPokemonSpecies = async(id: number, platform: Platform | undefined): Promise<IPokemonSpecies> => {
	const res = await fetchCacheFirst(pokeApiDomain + '/pokemon-species/' + id, platform);
	if (!res.ok){
		throw new Error(`Non-200 status code when fetching /pokemon-species - ${res.status}`);
	}
	return await res.json() as IPokemonSpecies;
}

export const fetchPokemonForm = async(url: string, platform: Platform | undefined): Promise<{sprites: ISprites;
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
		platform?.context.waitUntil(
			Logger.error(
				Logger.ErrorClasses.OptionalOperationFailed, 
				new Error(`Non-200 status code when fetching ${url} - ${res.status}`),
				{
					context: 'When processing forms for a Pokemon',
					request: url,
					responseStatus: res.status
				}
			)
		)
		return returnEmptyResponse();
	}

	try {
		const body = await res.json() as { sprites: ISprites; names: Name[] };
		return body;
	} catch(err){
		Logger.error(
			Logger.ErrorClasses.OptionalOperationFailed, 
			Logger.buildError(err),
			{
				context: 'Failed to parse response body',
				request: url
			}
		)
		return returnEmptyResponse();
	}
}

export const fetchPokemonEncounters = async(id: number, platform: Platform | undefined): Promise<IEncounterResponse[]> => {
	const url = `${pokeApiDomain}/pokemon/${id}/encounters`;
	const res = await fetchCacheFirst(url, platform);
	if (!res.ok){
		Logger.error(
			Logger.ErrorClasses.OptionalOperationFailed, 
			new Error(`Non-200 status code when fetching ${url} - ${res.status}`),
			{
				context: 'Failed to fetch encounters for a Pokemon',
				pokemon: id,
				request: url,
				responseStatus: res.status
			}
		)
		return [];		
	}
	return await res.json() as IEncounterResponse[];
}