import PokemonData from '$lib/data/pokemonNames.json';
import Abilities from '$lib/data/abilities.json';
import Items from '$lib/data/items.json';
import Moves from '$lib/data/moves.json';
import { getSearchParam, getCookieValue } from '../helpers';
import { termNormaliser } from '$lib/utils/string';
import type { IStaticPokemon } from '$lib/data/games';
import { Logger } from '$lib/log';

export async function GET({ request, platform }) {
	const searchTerm = getSearchParam(request.url, 'term');
	if (!searchTerm) {
		return respondWithJson({ error: 'No "term" value in URL' }, 400);
	}

	const normalisedTerm = decodeURIComponent(searchTerm.replace(/\+/g, ' '));

	const languages = [
		getSearchParam(request.url, 'primaryLanguage') ?? getCookieValue(request, 'primaryLanguage'),
		getSearchParam(request.url, 'secondaryLanguage') ?? getCookieValue(request, 'secondaryLanguage')
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
	});
}

const getPokemonResults = (searchTerm: string, languages: string[]): Promise<IStaticPokemon[]> => {
	const normalisedTerm = termNormaliser(searchTerm);

	return new Promise((resolve) => {
		const results = PokemonData.filter((pokemon) => {
			const idMatches = pokemon.id.toString().includes(searchTerm);
			if (idMatches && pokemon.id < 10000) {
				return true;
			}

			const foundPokemon = pokemon.names.find((name) => {
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
			return foundPokemon;
		}).sort((a, b) => {
			try {
				const aId = a.redirect ? (a.id < 10000 ? a.id : a.redirect.split('?')[0]) : a.id;
				const bId = b.redirect ? (b.id < 10000 ? b.id : b.redirect.split('?')[0]) : b.id;
				return aId > bId ? 1 : -1;
			} catch(err){
				Logger.error(
					Logger.ErrorClasses.OptionalOperationFailed,
					Logger.buildError(err),
					{
						context: 'Sorting pokemon results in /api/search and accounting for forms/varieties',
						pokemon1: a.id + a.redirect,
						pokemon2: b.id + b.redirect
					}
				)
			}
			return a.id > b.id ? 1 : -1;
		}).sort((a, b) => {
			const aId = a.redirect ? Number(a.redirect.split('?')[0]) : a.id;
			const bId = b.redirect ? Number(b.redirect.split('?')[0]) : b.id;

			if (aId === bId){
				if (a.redirect && b.redirect){
					return a.id < b.id ? 1 : -1;
				} 
				return -1;
			}
			return 1;
		});
		resolve(results);
	});
};

const getAbilityResults = (searchTerm: string, languages: string[]) => {
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

const getItemResults = (searchTerm: string, languages: string[]) => {
	const normalisedTerm = termNormaliser(searchTerm);

	return new Promise((resolve) => {
		const results = Items.filter((item) => {
			const foundEntry = item.names.find((name) => {
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

const getMoveResults = (searchTerm: string, languages: string[]) => {
	const normalisedTerm = termNormaliser(searchTerm);

	return new Promise((resolve) => {
		const results = Moves.filter((move) => {
			const foundEntry = move.names.find((name) => {
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

const respondWithJson = (payload: object | Array<unknown>, status?: number) => {
	const responseCode = status ?? payload ? 200 : 204;

	return new Response(JSON.stringify(payload), {
		headers: {
			'Content-Type': 'application/json'
		},
		status: responseCode
	});
};
