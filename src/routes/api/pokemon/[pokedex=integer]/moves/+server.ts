import { Logger } from "$/lib/log";
import { pokemonVarietyNameToDisplay, capitaliseFirstLetter } from "$/lib/utils/string";
import type { RequestHandler } from "msw";
import { fetchPokemon, fetchPokemonSpecies, fetchPokemonForm } from "../../cachedFetch";
import { parseUserPreferences } from "$/routes/api/helpers";
import type { IPokemonRequestPreferences } from "../../types";
import { formatMovesetToVersionEntries } from "$/lib/data/movesetFilter";

export const GET: RequestHandler = async ({ url, platform, cookies, params }) => {

    const requestPreferences: IPokemonRequestPreferences = {
		...parseUserPreferences(url, cookies),
		variety: url.searchParams.get('variety'),
		shiny: url.searchParams.get('shiny') === 'true',
		isFemale: url.searchParams.get('gender') === 'female',
	}
	const { primaryLanguage, secondaryLanguage, selectedGame, variety } = requestPreferences;
    
    // eslint-disable-next-line prefer-const
    let [pokemon, species] = await Promise.all([
		fetchPokemon(params.pokedex, platform),
		fetchPokemonSpecies(params.pokedex, platform),
	])



    const varietyEntry = species.varieties.find((entry) => entry.pokemon.name === variety);
	if (varietyEntry) {
		try {
			const parts = varietyEntry.pokemon.url.split('/');
			const id = Number(parts[parts.length - 2]);
			let varietyPokemon = await fetchPokemon(id, platform);

			const nameParts = varietyPokemon.name.split('-');

			if (!nameParts) {
				throw new Error(`Tried to process an invalid variety of a Pokemon`);
			}

			const varietyForm = varietyPokemon.forms.find((a) => a.name === varietyPokemon.name);
			const varietyName = pokemonVarietyNameToDisplay(varietyPokemon.name);

			if (varietyForm) {
				const varietyFormPokemon = await fetchPokemonForm(varietyForm?.url, platform);

				varietyPokemon = {
					...varietyPokemon,
					...varietyFormPokemon,
				};

				if (varietyFormPokemon.names.length && varietyFormPokemon.names.some((varietyName) => varietyName.language.name === primaryLanguage || varietyName.language.name === secondaryLanguage)) {
					species.names = varietyFormPokemon.names;
				} else {
					species.names = species.names.map((name) => {
						return {
							language: name.language,
							name: varietyName + ' ' + capitaliseFirstLetter(nameParts[0])
						};
					});
				}
			} else {
				species.names = species.names.map((name) => {
					return {
						language: name.language,
						name: varietyName + ' ' + capitaliseFirstLetter(nameParts[0])
					};
				});
			}

			pokemon = {
				...pokemon,
				...varietyPokemon
			};
		} catch (err) {
			platform?.context.waitUntil(
				Logger.error(
					Logger.ErrorClasses.RuntimeError, 
					new Error(`Something went wrong when trying to process Pokemon forms`),
					{
						context: 'Failed to parse Pokemon forms',
						pokemon: params.pokedex,
						variety: varietyEntry.pokemon.name
					}
				)
			)
		}
	}

    return new Response(JSON.stringify(
        formatMovesetToVersionEntries(pokemon.moves)
    ), {
		headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=86400',
        },
	}); 
}