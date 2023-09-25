import type { ParamMatcher } from '@sveltejs/kit';
import { lastPokedexEntry } from '$lib/domain';

export const match: ParamMatcher = (param) => {
	return Number(param) >= 1 && Number(param) <= lastPokedexEntry;
};
