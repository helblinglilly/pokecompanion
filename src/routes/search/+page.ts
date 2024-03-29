import { Logger } from '$lib/log.js';

export interface IResults {
	pokemon: any[];
	items: any[];
	abilities: any[];
	moves: any[];
}

export const load = async ({ fetch, url }) => {
	const searchTerm = url.searchParams.get('term');
	const primLangOverride = url.searchParams.get('primaryLanguage');
	const secLangOverride = url.searchParams.get('secondaryLanguage');

	const results: IResults = {
		pokemon: [],
		items: [],
		abilities: [],
		moves: []
	};

	let errorMessage = '';

	try {
		const url = `/api/search?term=${searchTerm}${
			primLangOverride ? `&primaryLanguage=${primLangOverride}` : ''
		}${secLangOverride ? `&secondaryLanguage=${secLangOverride}` : ''}`;
		const response = await fetch(url);
		const body = (await response.json()) as { data: IResults };
		results.pokemon = body.data.pokemon;
		results.items = body.data.items;
		results.abilities = body.data.abilities;
		results.moves = body.data.moves;

		if (
			results.abilities.length === 0 &&
			results.items.length === 0 &&
			results.moves.length === 0 &&
			results.pokemon.length === 0
		) {
			errorMessage = 'No search results. Try another search';
		} else {
			errorMessage = '';
		}
	} catch (err) {
		errorMessage = "Couldn't get search results";
		await Logger.error(
			Logger.ErrorClasses.SearchResults,
			Logger.buildError(err),
			{
				context: 'When fetching search results',
				searchTerm
			}
		)
	}

	return {
		errorMessage,
		results,
		searchTerm
	};
};
