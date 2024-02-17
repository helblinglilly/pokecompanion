import { findGameFromString } from '$lib/data/games.js';
import { getMove } from '$lib/types/IMoves';

export async function load({ params, cookies }) {
	const moveId = Number(params.slug);
	const game = findGameFromString(cookies.get('selectedGame'));

	const move = await getMove(moveId, game);

	return {
		move
	};
}
