export const capitaliseFirstLetter = (input: string) => {
	if (!input) return input;
	const first = input.charAt(0).toUpperCase();
	const rest = input.slice(1);
	return first + rest;
};

/**
 * To be used when trying to convert variety names such as wooper-paldea into Paldea
 * @param name
 */
export const pokemonVarietyNameToDisplay = (name: string) => {
	if (!name || !name.includes('-')) {
		return '';
	}

	const parts = name.split('-');
	if (parts.length >= 2 && parts[1]) {
		return capitaliseFirstLetter(parts[1]);
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
