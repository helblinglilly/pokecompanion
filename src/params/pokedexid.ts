import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => {
	return /\b(?:[1-9]\d{0,2}|1000|100[0-9]|1010)\b/.test(param);
};
