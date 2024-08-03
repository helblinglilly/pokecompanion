import { termNormaliser } from "$/lib/utils/string";
import Abilities from '$lib/data/abilities.json';

export const getAbilityResults = (searchTerm: string, languages: string[]) => {
	const normalisedTerm = termNormaliser(searchTerm);

	return new Promise((resolve) => {
		const results = Abilities.filter((ability) => {
			const foundEntry = ability.names.find((name) => {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const lang1 = termNormaliser(name[languages[0]]);
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const lang2 = termNormaliser(name[languages[1]]);

				if (lang1 && !lang2) {
					return lang1.includes(normalisedTerm);
				} else if (lang2 && !lang1) {
					return lang2.includes(normalisedTerm);
				} else if (lang1 && lang2) {
					return lang1.includes(normalisedTerm) || lang2.includes(normalisedTerm);
				}
				return false;
			});
			return foundEntry;
		});
		resolve(results);
	});
};