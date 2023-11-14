import { getPokemonPageData } from '$lib/pokemon-id/pokemonPage.js';

export const load = async ({ params }) => {
	const id = Number(params.slug);
	const data = await getPokemonPageData(id);

	return {
		...data
	};
};
