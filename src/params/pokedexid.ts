import type { ParamMatcher } from '@sveltejs/kit';
import { lastPokedexEntry } from '$lib/stores/domain';

export const match: ParamMatcher = (param) => {
	return Number(param) >= 1 && Number(param) <= lastPokedexEntry;
};
