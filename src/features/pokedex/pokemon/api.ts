import type { paths } from '$/@types/api';
import { PUBLIC_API_HOST } from '$env/static/public';

export const getPokedexPokemon = async (
	pokedexId: number,
	pokemonId: number,
	query: paths['/pokedex/{pokedexId}/pokemon/{pokemonInPokedexId}']['get']['parameters']['query'],
	propFetch?: typeof globalThis.fetch
) => {
	const fetchSafe = propFetch ?? fetch;

	const url = new URL(`/pokedex/${pokedexId}/pokemon/${pokemonId}`, PUBLIC_API_HOST);
	if (query) {
		Object.entries(query).forEach(([key, value]) => {
			if (typeof value === 'string' || typeof value === 'number') {
				url.searchParams.append(key, value.toString());
			}
		});
	}

	const res = await fetchSafe(url, {
		credentials: 'include'
	});

	if (res.status !== 200) {
		throw new Error(`Tried to get a Pokedex Pokemon but got HTTP ${res.status}`);
	}

	return (await res.json()) as paths['/pokedex/{pokedexId}/pokemon/{pokemonInPokedexId}']['get']['responses']['200']['content']['application/json'];
};
