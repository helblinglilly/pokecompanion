import { getAllPokedexes } from '$/features/pokedex/api';

export async function load({ fetch }) {
	const pokedexes = await getAllPokedexes(fetch);

	return {
		pokedexes
	};
}
