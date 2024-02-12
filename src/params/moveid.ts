import type { ParamMatcher } from '@sveltejs/kit';
import Moves from '$lib/data/moves.json';

export const match: ParamMatcher = (param) => {
	return Number(param) >= 1 && Number(param) <= Moves[Moves.length - 1].id;
};
