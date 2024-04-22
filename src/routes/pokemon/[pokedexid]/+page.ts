import { error } from '@sveltejs/kit';
import type { IPokemonResponse } from '../../api/pokemon/types';
import { get } from 'svelte/store';
import { findGameFromString } from '$lib/data/games';
import { selectedGame, primaryLanguage, secondaryLanguage } from '$lib/stores/domain';
import type { IPokemonMoveAPIResponse } from '../../api/pokemon/[pokedex]/moves/+server';

const loadMoveData = async (url: URL, fetchFn: (_a: URL) => Promise<Response>): Promise<IPokemonMoveAPIResponse> => {
	const moveUrl = new URL(url.origin + url.pathname + '/moves' + url.search)

	const fetchResponse = await fetchFn(moveUrl);
	if (fetchResponse.ok){
		const data = await fetchResponse.json() as IPokemonMoveAPIResponse;
		return data;
	}
	return {};
}

export const load = async ({ params, fetch, url }) => {
	const requestUrl = new URL(`${url.origin}/api/pokemon/${params.pokedexid}`);

	requestUrl.searchParams.append('primaryLanguage', url.searchParams.get('primaryLanguage') ?? get(primaryLanguage));
	requestUrl.searchParams.append('secondaryLanguage', url.searchParams.get('secondaryLanguage') ?? get(secondaryLanguage) ?? '');
	requestUrl.searchParams.append('variety', url.searchParams.get('variety') ?? '');
	const game = findGameFromString(url.searchParams.get('game') ?? get(selectedGame)?.cookieGroup);

	if (game){
		requestUrl.searchParams.append('game', game.cookieGroup)
	}

	const res = await fetch(requestUrl).catch((err) => {
		error(500, (err as unknown as Error).message)
	});

	if (!res.ok){
		if (res.status == 404){
			error(404, `${params.pokedexid} is outside the known range of Pokemon`)
		} else {
			error(500, `Failed to fetch API data - ${res.status}`)
		}
	}

	try {
		const pokemonData = await res.json() as IPokemonResponse;

		return {
			...pokemonData,
			moveData: loadMoveData(requestUrl, fetch)
		}
	} catch {
		error(500, `Failed to parse JSON response from internal API - ${res.status}`)
	}
};
