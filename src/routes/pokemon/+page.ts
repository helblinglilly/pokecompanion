import { redirect } from '@sveltejs/kit';
import { pokemonPageSize } from '$lib/stores/domain';
import AdjustedPokemonNames from './pokemonNames';

export function load({ url }) {
	const jumpToId = url.searchParams.get('jumpTo');

	if (jumpToId) {
		const index = AdjustedPokemonNames.findIndex((mon) => mon.id === Number(jumpToId));
		if (index !== -1){
			const targetPage = Math.ceil(index / pokemonPageSize);
			redirect(302, `/pokemon?page=${targetPage}#${jumpToId}`);
		}
	}
}
