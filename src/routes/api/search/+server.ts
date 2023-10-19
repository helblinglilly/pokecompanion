import PokemonData from '$lib/data/pokemonNames.json';
import Abilities from '$lib/data/abilities.json';
import Items from '$lib/data/items.json';
import Moves from '$lib/data/moves.json';

const getSearchParam = (url: string, name: string) => {
	const searchParts = url.split('?')[1];
	if (!searchParts) {
		return;
	}
	const result = searchParts.split('&').find((keypair) => {
		const [key] = keypair.split('=');
		return key === name;
	});

	if (!result) {
		return;
	}

	return result.split('=')[1];
};

const getCookies = (request: Request) => {
	let result = '';
	request.headers.forEach((val, key) => {
		if (key === 'cookie') {
			result = val;
		}
	});
	return result;
};
const getCookieValue = (request: Request, name: string) => {
	const cookieValues = getCookies(request);
	if (!cookieValues) {
		return '';
	}

	const values = cookieValues.split('; ');
	let result = '';
	values.find((value) => {
		const [key, val] = value.split('=');
		if (key === name) {
			result = val;
		}
	});
	return result;
};

export async function GET({ request }) {
	const searchTerm = getSearchParam(request.url, 'term');
	if (!searchTerm) {
		return respondWithJson({ error: 'No "term" value in URL' }, 400);
	}

	const languages = [
		getCookieValue(request, 'primaryLanguage'),
		getCookieValue(request, 'secondaryLanguage')
	];
	const [pokemonResults, abilityResults, itemResults, moveResults] = await Promise.all([
		getPokemonResults(searchTerm, languages),
		getAbilityResults(searchTerm, languages),
		getItemResults(searchTerm, languages),
		getMoveResults(searchTerm, languages)
	]);

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

const getPokemonResults = (searchTerm: string, languages: string[]) => {
	return new Promise((resolve) => {
		const results = PokemonData.filter((pokemon) => {
			const idMatches = pokemon.id.toString().includes(searchTerm);
			if (idMatches) {
				return true;
			}

			const foundPokemon = pokemon.names.find((name) => {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const lang1 = name[languages[0]] as string | undefined;
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const lang2 = name[languages[1]] as string | undefined;

				if (lang1 && !lang2) {
					return lang1.toLowerCase().includes(searchTerm.toLowerCase());
				} else if (lang2 && !lang1) {
					return lang2.toLowerCase().includes(searchTerm.toLowerCase());
				} else if (lang1 && lang2) {
					return (
						lang1.toLowerCase().includes(searchTerm.toLowerCase()) ||
						lang2.toLowerCase().includes(searchTerm.toLowerCase())
					);
				}
				return false;
			});
			return foundPokemon;
		});
		resolve(results);
	});
};

const getAbilityResults = (searchTerm: string, languages: string[]) => {
	return new Promise((resolve) => {
		const results = Abilities.filter((ability) => {
			const foundEntry = ability.names.find((name) => {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const lang1 = name[languages[0]] as string | undefined;
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const lang2 = name[languages[1]] as string | undefined;

				if (lang1 && !lang2) {
					return lang1.toLowerCase().includes(searchTerm.toLowerCase());
				} else if (lang2 && !lang1) {
					return lang2.toLowerCase().includes(searchTerm.toLowerCase());
				} else if (lang1 && lang2) {
					return (
						lang1.toLowerCase().includes(searchTerm.toLowerCase()) ||
						lang2.toLowerCase().includes(searchTerm.toLowerCase())
					);
				}
				return false;
			});
			return foundEntry;
		});
		resolve(results);
	});
};

const getItemResults = (searchTerm: string, languages: string[]) => {
	return new Promise((resolve) => {
		const results = Items.filter((item) => {
			const foundEntry = item.names.find((name) => {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const lang1 = name[languages[0]] as string | undefined;
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const lang2 = name[languages[1]] as string | undefined;

				if (lang1 && !lang2) {
					return lang1.toLowerCase().includes(searchTerm.toLowerCase());
				} else if (lang2 && !lang1) {
					return lang2.toLowerCase().includes(searchTerm.toLowerCase());
				} else if (lang1 && lang2) {
					return (
						lang1.toLowerCase().includes(searchTerm.toLowerCase()) ||
						lang2.toLowerCase().includes(searchTerm.toLowerCase())
					);
				}
				return false;
			});
			return foundEntry;
		});
		resolve(results);
	});
};

const getMoveResults = (searchTerm: string, languages: string[]) => {
	return new Promise((resolve) => {
		const results = Moves.filter((move) => {
			const foundEntry = move.names.find((name) => {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const lang1 = name[languages[0]] as string | undefined;
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const lang2 = name[languages[1]] as string | undefined;

				if (lang1 && !lang2) {
					return lang1.toLowerCase().includes(searchTerm.toLowerCase());
				} else if (lang2 && !lang1) {
					return lang2.toLowerCase().includes(searchTerm.toLowerCase());
				} else if (lang1 && lang2) {
					return (
						lang1.toLowerCase().includes(searchTerm.toLowerCase()) ||
						lang2.toLowerCase().includes(searchTerm.toLowerCase())
					);
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
