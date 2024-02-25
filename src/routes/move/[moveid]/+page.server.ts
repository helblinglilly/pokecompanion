import { findGameFromString } from '$lib/data/games.js';
import { getMove } from '$lib/types/IMoves';
import Moves from '$lib/data/moves.json';
import { error } from '@sveltejs/kit';

/**
 * See https://github.com/PokeAPI/pokeapi/issues/1048
 * This function deals with Z Moves not having anything in their flavour_text_entries.
 *
 * These moves will currently show duplicate search results for their --physical and
 * --special entries. To prevent this, ensure that the dummy entry is removed from the
 * DB.
 *
 * They are not wired up to any Pokémon (as this is done by types), so there should be
 * no dead links because of this.
 * @param id The move ID which the user has requested.
 * @returns The move id for the entry with full flavour_text_entries data
 */
const redirectOffDummyData = (id: number) => {
	// dummyEntry: realEntry
	const pairs: { [key: number]: number } = {
		623: 622,
		625: 624,
		627: 626,
		629: 628,
		631: 630,
		633: 632,
		635: 634,
		637: 636,
		639: 638,
		641: 640,
		643: 642,
		645: 644,
		647: 646,
		649: 648,
		651: 650,
		653: 652,
		655: 654,
		657: 656
	};

	return pairs[id] ?? id;
};

export async function load({ params, cookies }) {
	const moveId = redirectOffDummyData(Number(params.moveid));
	if (moveId < 1 || moveId > Moves[Moves.length - 1].id) {
		error(404, 'Move not found');
	}
	const game = findGameFromString(cookies.get('selectedGame'));

	const move = await getMove(moveId, game);

	return {
		move
	};
}
