import { error } from '@sveltejs/kit';
import type { IPokemonResponse } from '../../api/pokemon/types';
import { get } from 'svelte/store';
import { selectedGame, primaryLanguage, secondaryLanguage, animateSprites, versionSpecificPokemonSprites } from '$lib/stores/domain';
import { getGameGroupFromName, PokeapiVersionGroups } from '$lib/data/games';

export const load = async ({ params, fetch, url }) => {
	const requestUrl = new URL(`${url.origin}/api/pokemon/${params.pokedexid}`);

	requestUrl.searchParams.append('primaryLanguage', url.searchParams.get('primaryLanguage') ?? get(primaryLanguage));
	requestUrl.searchParams.append('secondaryLanguage', url.searchParams.get('secondaryLanguage') ?? get(secondaryLanguage) ?? '');
	requestUrl.searchParams.append('variety', url.searchParams.get('variety') ?? '');
	requestUrl.searchParams.append('shiny', url.searchParams.get('shiny') ?? '');
	requestUrl.searchParams.append('gender', url.searchParams.get('gender') ?? '');
	requestUrl.searchParams.append('animateSprites', url.searchParams.get('animateSprites') ?? `${get(animateSprites)}`);
	const game = getGameGroupFromName(url.searchParams.get('game') as PokeapiVersionGroups ?? get(selectedGame)?.pokeapi)
	const showGameSpecificPokemonSprites = url.searchParams.get('versionSpecificPokemonSprites') ?? get(versionSpecificPokemonSprites);

	if (game && showGameSpecificPokemonSprites){
		requestUrl.searchParams.append('game', game.pokeapi)
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
		return pokemonData;
	} catch {
		error(500, `Failed to parse JSON response from internal API - ${res.status}`)
	}
};
