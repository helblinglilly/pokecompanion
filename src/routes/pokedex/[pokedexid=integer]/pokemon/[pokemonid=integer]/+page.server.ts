import type { paths } from '$/@types/api';
import type { APIPokemon } from '$/@types/api.pokecompanion';
import { getPokedexPokemon, getPokemon } from '$/features/pokedex/pokemon/api';
import { addCookiesAsSearchParams } from '$/lib/api/fetch.js';
import { PUBLIC_API_HOST } from '$env/static/public';

export async function load({ fetch, params, url, cookies }) {
	// Extract query parameters from the URL
	const queryParams = {
		page: url.searchParams.get('page') ? Number(url.searchParams.get('page')) : undefined,
		pageSize: url.searchParams.get('pageSize')
			? Number(url.searchParams.get('pageSize'))
			: undefined,
		jumpTo: url.searchParams.get('jumpTo') ? Number(url.searchParams.get('jumpTo')) : undefined,
		gender: url.searchParams.get('gender') as 'male' | 'female' | undefined,
		variety: url.searchParams.get('variety') || undefined,
		shiny: url.searchParams.get('shiny') as 'true' | 'false' | undefined,
		animateSprites: url.searchParams.get('animateSprites') as 'true' | 'false' | undefined,
		versionSpecificPokemonSprites: url.searchParams.get('versionSpecificPokemonSprites') as
			| 'true'
			| 'false'
			| undefined,
		versionSpecificTypeSprites: url.searchParams.get('versionSpecificTypeSprites') as
			| 'true'
			| 'false'
			| undefined,
		primaryLanguage: url.searchParams.get('primaryLanguage') as any,
		secondaryLanguage: url.searchParams.get('secondaryLanguage') as any,
		gameEntry: url.searchParams.get('gameEntry') as any
	};

	// Filter out undefined values to pass only the params that were actually provided
	const filteredParams = Object.fromEntries(
		Object.entries(queryParams).filter(([_, v]) => v !== undefined)
	);

	const pokedex = await getPokedexPokemon(
		Number(params.pokedexid),
		Number(params.pokemonid),
		filteredParams,
		fetch
	);

	const pokemon = await getPokemon(pokedex.navigation.current.speciesId, queryParams, fetch);

	async function getFullAbility(ability: APIPokemon['abilities'][number]) {
		const abilityUrl = addCookiesAsSearchParams(
			new URL(`${PUBLIC_API_HOST}/ability/${ability.id}`),
			url.searchParams,
			cookies
		);

		const res = await fetch(abilityUrl, {
			credentials: 'include'
		});

		if (res.status !== 200) {
			throw new Error('Failed to get abilities');
		}

		return (await res.json()) as paths['/ability/{id}']['get']['responses']['200']['content']['application/json'];
	}

	async function getFullMoves() {
		const moveRequestUrl = addCookiesAsSearchParams(
			new URL(`${PUBLIC_API_HOST}/pokemon/${params.pokedexid}/moves`),
			url.searchParams,
			cookies
		);

		const request = await fetch(moveRequestUrl, {
			credentials: 'include'
		});

		if (request.status !== 200) {
			throw new Error('Failed to get moves');
		}
		return (await request.json()) as paths['/pokemon/{id}/moves']['get']['responses']['200']['content']['application/json'];
	}

	return {
		pokedex,
		pokemon,
		abilities: pokemon.abilities.map((ability) => {
			return {
				...ability,
				data: getFullAbility(ability)
			};
		}),
		fullMoves: getFullMoves()
	};
}
