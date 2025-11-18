import type { PokeapiLanguageCodes } from '$/@types/api.pokecompanion';
import type { Name } from '$lib/types/IPokemon';

export type Languages = Record<PokeapiLanguageCodes, string | undefined>;

export const getLanguageEntry = (entries: Languages[], languageCode: keyof Languages) => {
	let result: string | undefined;

	entries.forEach((entry) => {
		if (entry[languageCode]) {
			result = entry[languageCode];
		}
	});

	return result;
};

export const getMultiLanguageName = (
	entries: Languages[],
	languageCode: keyof Languages,
	secondaryCode: keyof Languages | undefined,
	prefix?: string | undefined
) => {
	const primaryLanguage = getLanguageEntry(entries, languageCode);
	const secondaryLanguage = secondaryCode ? getLanguageEntry(entries, secondaryCode) : undefined;

	if (!secondaryLanguage && !primaryLanguage) {
		return 'Missing data';
	} else if (primaryLanguage && !secondaryLanguage) {
		return prefix ? `${prefix} ${primaryLanguage}` : primaryLanguage;
	} else if (secondaryLanguage && !primaryLanguage) {
		return prefix ? `${prefix} ${secondaryLanguage}` : secondaryLanguage;
	} else if (primaryLanguage === secondaryLanguage) {
		return prefix ? `${prefix} ${primaryLanguage}` : primaryLanguage;
	} else if (primaryLanguage !== secondaryLanguage) {
		return prefix
			? `${prefix}: ${primaryLanguage} - ${secondaryLanguage}`
			: `${primaryLanguage} - ${secondaryLanguage}`;
	}
};

export const speciesNamesToNormalisedNames = (input: Name[]) => {
	return input.map((item) => {
		const languageName = item.language.name;
		const languageValue = item.name;

		return { [languageName]: languageValue };
	});
};

export const getNameEntry = (entries: Name[], languageCode: keyof Languages | undefined) => {
	const entry = entries.find((a) => {
		return a.language.name === languageCode;
	});

	if (entry) {
		return entry.name;
	}
	return undefined;
};

export const getNameEntries = (
	entries: Name[],
	primary: keyof Languages,
	secondary?: keyof Languages
) => {
	return {
		primary: getNameEntry(entries, primary),
		secondary: secondary ? getNameEntry(entries, secondary) : undefined
	};
};

export const joinNameEntries = (
	nameEntries: { primary: string | undefined; secondary: string | undefined },
	joinChar: string
): string => {
	if (nameEntries.primary && !nameEntries.secondary) {
		return nameEntries.primary;
	} else if (nameEntries.secondary && !nameEntries.primary) {
		return nameEntries.secondary;
	}

	if (nameEntries.primary && nameEntries.primary === nameEntries.secondary) {
		return nameEntries.primary;
	}

	if (!nameEntries.primary && !nameEntries.secondary) {
		return 'No data';
	}

	return `${nameEntries.primary} ${joinChar} ${nameEntries.secondary}`;
};
