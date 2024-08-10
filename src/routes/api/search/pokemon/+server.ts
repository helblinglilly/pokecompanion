import { getGame, getGameGroupFromGame, isPokemonInGameGroup, PokeapiVersionNames } from '$/lib/data/games.js';
import { Logger } from '$lib/log';
import { parseUserPreferences, respondWithJson } from '../../helpers.js';
import { getPokemonResults } from '../pokemon.js';

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

	let pokemonResults = await getPokemonResults(normalisedTerm, languages).catch((err) => {
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
		return [];
	});
	
	const game = url.searchParams.get('game') as PokeapiVersionNames | 'generic';

	if (game !== 'generic'){
		const parsedGame = getGame(game);

		pokemonResults = pokemonResults.map((result) => {
			return {
				...result,
				inGame: isPokemonInGameGroup(result.id, getGameGroupFromGame(parsedGame))
			}
		})
	}

	return respondWithJson({
		data: {
			pokemon: pokemonResults,
		},
		searchTerm: searchTerm
	}, 200, true);
}


