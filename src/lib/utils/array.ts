export function uniques<T>(array: T[]): T[] {
	return Array.from(new Set(array));
}

export function dropFalsey<T>(array: T[]): T[] {
	return array.filter((entry) => {
		return entry;
	});
}
