import { lastPokedexEntry } from '$lib/stores/domain';
import { formatMovesetToVersionEntries } from '$lib/data/movesetFilter';
import { Logger } from '$lib/log';
import type { RequestHandler } from '@sveltejs/kit';
import { parseUserPreferences } from '$/routes/api/helpers';
import { fetchPokemon, fetchPokemonSpecies } from '../../cachedFetch';
import type { IPokemonRequestPreferences } from '../../types';

export const GET: RequestHandler = async ({ url, platform, cookies, params }) => {	
	const id = Number(params.pokedex);
	if (!id){
		return new Response(JSON.stringify({
			error: 'Missing pokemon in search params',
			searchParam: 'pokemon=:id'
		}), {
			status: 404,
			headers: {
				'content-type': 'application/json'
			}
		})
	}

	if (id < 1 || id > lastPokedexEntry){
		return new Response(JSON.stringify({
			error: 'Pokemon is outside of known range',
			knownPokemon: {
				from: 1,
				to: lastPokedexEntry
			},
			requested: id
		}), {
			status: 404,
			headers: {
				'content-type': 'application/json'
			}
		})
	}

	const requestPreferences: IPokemonRequestPreferences = {
		...parseUserPreferences(url, cookies),
		variety: url.searchParams.get('variety'),
		shiny: url.searchParams.get('shiny') === 'true',
		isFemale: url.searchParams.get('gender') === 'female',
	}
	const { primaryLanguage, secondaryLanguage, selectedGame, variety } = requestPreferences;
	
	// Only some values may get rassigned
	// eslint-disable-next-line prefer-const 
	let [pokemon, species] = await Promise.all([
		fetchPokemon(id, platform),
		fetchPokemonSpecies(id, platform),
	])

	const varietyEntry = species.varieties.find((entry) => entry.pokemon.name === variety);
	if (varietyEntry) {
		try {
			const parts = varietyEntry.pokemon.url.split('/');
			const id = Number(parts[parts.length - 2]);
			const varietyPokemon = await fetchPokemon(id, platform);

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
						pokemon: id,
						variety: varietyEntry.pokemon.name
					}
				)
			)
		}
	}
	const moves = formatMovesetToVersionEntries(pokemon.moves)

	const response = selectedGame ? moves[selectedGame.pokeapi] : moves;
	return new Response(JSON.stringify(response), {
		headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=86400',
        },
	});
};
