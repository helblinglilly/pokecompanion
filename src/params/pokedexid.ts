import type { ParamMatcher } from '@sveltejs/kit';
import { lastPokedexEntry } from '$lib/domain';

export const match: ParamMatcher = (param) => {
	if (Number(param) >= 1 && Number(param) <= lastPokedexEntry) {
		return true;
	}
	return false;
};
