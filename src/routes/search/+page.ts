import { error, logToAxiom } from '$lib/log';

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
			logToAxiom({ action: 'no-search-results', searchTerm });
		} else {
			errorMessage = '';
		}
	} catch (err) {
		errorMessage = "Couldn't get search results";
		error('Error occurred when getting search results', 'SearchResultsError', err);
	}

	return {
		errorMessage,
		results,
		searchTerm
	};
};
