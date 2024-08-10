import { Logger } from '$lib/log';
import { parseUserPreferences, respondWithJson } from '../helpers.js';
import { getAbilityResults } from './abilities.js';
import { getItemResults } from './items.js';
import { getMoveResults } from './moves.js';
import { getPokemonResults } from './pokemon.js';

export async function GET({ request, platform, cookies }) {
	const url = new URL(request.url);

	const searchTerm = url.searchParams.get('term');
	if (!searchTerm) {
		return respondWithJson({ error: 'No "term" value in URL' }, 400);
	}

	const normalisedTerm = decodeURIComponent(searchTerm.replace(/\+/g, ' '));

	const userPreferences = parseUserPreferences(url, cookies);

	const languages = [
		userPreferences.primaryLanguage ?? 'en',
		userPreferences.secondaryLanguage ?? ''
	];

	const [pokemonResults, abilityResults, itemResults, moveResults] = await Promise.all([
		getPokemonResults(normalisedTerm, languages),
		getAbilityResults(normalisedTerm, languages),
		getItemResults(normalisedTerm, languages),
		getMoveResults(normalisedTerm, languages)
	]).catch((err) => {
		platform?.context.waitUntil(
			Logger.error(
				Logger.ErrorClasses.SearchResults,
				Logger.buildError(err),
				{
					searchTerm,
					primaryLanguage: languages[0],
					secondaryLanguage: languages[1]
				}
			)
		)
		return [[], [], [], []];
	});

	return respondWithJson({
		data: {
			abilities: abilityResults,
			pokemon: pokemonResults,
			items: itemResults,
			moves: moveResults
		},
		searchTerm: searchTerm
	}, 200, true);
}