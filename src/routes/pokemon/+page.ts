import { redirect } from '@sveltejs/kit';
import { pokemonPageSize } from '$lib/stores/domain';
import PokemonNames from '$lib/data/pokemonNames.json';

export function load({ url }) {
	const jumpToItem = url.searchParams.get('jumpTo');

	if (jumpToItem) {
		console.log(jumpToItem);
		const item = Number(jumpToItem);
		if (item < PokemonNames.length && item >= 1) {
			const targetPage = Math.ceil(item / pokemonPageSize);
			throw redirect(302, `/pokemon?page=${targetPage}#${item}`);
		}
	}
}
