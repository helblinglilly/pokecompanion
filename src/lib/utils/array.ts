export function uniques<T>(array: T[]): T[] {
	return Array.from(new Set(array.map((item) => JSON.stringify(item)))).map((item) => {
		try {
			return JSON.parse(item);
		} catch {
			return undefined;
		}
	});
}

export function dropFalsey<T>(array: T[]): T[] {
	return array.filter((entry) => {
		return entry;
	});
}
