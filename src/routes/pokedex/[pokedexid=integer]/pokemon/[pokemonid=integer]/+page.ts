import { getPokedexPokemon } from '$/features/pokedex/pokemon/api';

export async function load({ fetch, params, url }) {
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

	return {
		pokedex
	};
}
