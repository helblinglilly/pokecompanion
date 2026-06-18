import { getAllPokedexes } from '$/features/pokedex/api';
import { getLoadFetch } from '$lib/api/loadFetch';

export async function load({ fetch }) {
	const runtimeFetch = getLoadFetch(fetch);
	const pokedexes = await getAllPokedexes(runtimeFetch);

	return {
		pokedexes
	};
}
