export interface Languages {
	'ja-Hrkt'?: string;
	roomaji?: string;
	ko?: string;
	fr?: string;
	de?: string;
	en?: string;
	ja?: string;
	none?: string | undefined;
}

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
	secondaryCode: keyof Languages | undefined
) => {
	const primaryLanguage = getLanguageEntry(entries, languageCode);
	const secondaryLanguage = secondaryCode ? getLanguageEntry(entries, secondaryCode) : undefined;

	if (!secondaryLanguage && !primaryLanguage) {
		return 'Missing data';
	} else if (primaryLanguage && !secondaryLanguage) {
		return primaryLanguage;
	} else if (secondaryLanguage && !primaryLanguage) {
		return secondaryLanguage;
	} else if (primaryLanguage === secondaryLanguage) {
		return primaryLanguage;
	} else if (primaryLanguage !== secondaryLanguage) {
		return `${primaryLanguage} - ${secondaryLanguage}`;
	}
};
