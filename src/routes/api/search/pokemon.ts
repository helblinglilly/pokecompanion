import type { IStaticPokemon } from "$/lib/data/games";
import { Logger } from "$/lib/log";
import { termNormaliser } from "$/lib/utils/string";
import PokemonData from '$lib/data/pokemonNames.json';

export const getPokemonResults = (searchTerm: string, languages: string[]): Promise<IStaticPokemon[]> => {
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
		})
		.map((a) => {
			const id = Number(a.redirect ? a.redirect.split('?')[0] : a.id);
			const variety = a.redirect ? a.redirect.split('variety=')[1] : undefined;
			return {
				...a,
				id,
				variety
			}
		})
		.sort((a, b) => {
			return a.id < b.id ? -1 : 1
		})
		resolve(results);
	});
};