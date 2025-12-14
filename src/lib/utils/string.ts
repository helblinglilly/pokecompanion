export const capitaliseFirstLetter = (input: string) => {
	if (!input) return input;
	const first = input.charAt(0).toUpperCase();
	const rest = input.slice(1);
	return first + rest;
};

export const capitaliseEachWord = (input: string) => {
	return input
		.split(' ')
		.map((a) => capitaliseFirstLetter(a))
		.join(' ');
};

/**
 * To be used when comparing strings in search
 * @param term
 * @returns
 */
export const termNormaliser = (term: string) => {
	if (!term) {
		return '';
	}

	return term
		.toLowerCase()
		.trim()
		.replace(/[^a-zA-Z0-9]/g, '');
};
