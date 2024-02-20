import { findGameFromString } from '$lib/data/games.js';
import { getMove } from '$lib/types/IMoves';
import Moves from '$lib/data/moves.json';
import { error } from '@sveltejs/kit';

export async function load({ params, cookies }) {
	const moveId = Number(params.moveid);
	if (moveId < 1 || moveId > Moves[Moves.length - 1].id) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore Docs literally say passing strings is supported
		throw error(404, 'Move not found');
	}
	const game = findGameFromString(cookies.get('selectedGame'));

	const move = await getMove(moveId, game);

	return {
		move
	};
}
