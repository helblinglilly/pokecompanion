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
 * To be used when trying to convert variety names such as wooper-paldea into Paldea
 * @param name
 */
export const pokemonVarietyNameToDisplay = (name: string) => {
	if (!name || !name.includes('-') || name.endsWith('-default')) {
		return '';
	}

	const parts = name.split('-');
	if (parts.length >= 2) {
		const varietyParts = parts.slice(1).map((a) => capitaliseFirstLetter(a));
		return capitaliseFirstLetter(varietyParts.join(' '));
	}
	return '';
};

export const removeLastCharIfExists = (input: string, character: string) => {
	const copy = input.slice();
	if (copy.endsWith(character)) {
		return copy.slice(0, copy.length - 1);
	}
	return copy;
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
