export const capitaliseFirstLetter = (input: string) => {
	if (!input) return input;
	const first = input.charAt(0).toUpperCase();
	const rest = input.slice(1);
	return first + rest;
};
