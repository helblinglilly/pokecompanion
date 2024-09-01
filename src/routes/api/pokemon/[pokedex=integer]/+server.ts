import { lastPokedexEntry } from '$lib/stores/domain';
import { type FlavorTextEntry} from '$lib/types/IPokemon';
import { capitaliseFirstLetter, pokemonVarietyNameToDisplay } from '$lib/utils/string';
import { fixAbilities, getPokemonTypesInGame, getTypeRelations } from '$lib/data/generationAdjuster';
import { formatEncounters } from '$lib/data/encounterFilter';
import { formatMovesetToVersionEntries } from '$lib/data/movesetFilter';
import { speciesNamesToNormalisedNames } from '$lib/utils/language';
import { parseUserPreferences } from '../../helpers';
import type { IPokemonRequestPreferences, IPokemonResponse, ISpritesConsumable } from '../types';
import { Logger } from '$lib/log';
import { fetchPokemon, fetchPokemonEncounters, fetchPokemonForm, fetchPokemonSpecies } from '../cachedFetch';
import { getGame } from '$lib/data/games';
import type { RequestHandler } from '@sveltejs/kit';
import { getPokemonSprite } from './sprite/internal';

const filterPokedexEntries = (
	allEntries: FlavorTextEntry[],
	primaryLang: string | undefined,
	secondaryLang: string | undefined
) => {
	const hasMatchingLanguageEntries = allEntries.some(
		(entry) => entry.language.name === primaryLang || entry.language.name === secondaryLang
	);

	return allEntries
		.filter((entry) => {
			if (!hasMatchingLanguageEntries) {
				return true;
			}
			return entry.language.name === primaryLang || entry.language.name === secondaryLang;
		})
		.map((entry) => {
			let newGame = getGame(entry.version.name)?.shortName ?? entry.version.name;
			
			if (newGame === 'omega-ruby'){
				newGame = "Omega Ruby"
			} else if (newGame === 'alpha-sapphire'){
				newGame = "Alpha Sapphire";
			}

			return {
				language: entry.language.name,
				game: newGame,
				// eslint-disable-next-line no-control-regex
				textEntry: entry.flavor_text.replace(/\n|\u000c/g, ' ')
			};
		});
	// To do: Move the selected game entry to the top
};

const fetchSprites = async (id: number, preferences: IPokemonRequestPreferences, platform: Readonly<App.Platform> | undefined): Promise<ISpritesConsumable & { hasShiny: boolean; hasFemale: boolean;}> => {
	const [frontRes, backRes] = await Promise.allSettled([
		getPokemonSprite(id, platform, preferences.selectedGame, preferences.variety, preferences.shiny, preferences.isFemale, false, preferences.animateSprites),
		getPokemonSprite(id, platform, preferences.selectedGame, preferences.variety, preferences.shiny, preferences.isFemale, true, preferences.animateSprites)
	]);

	const values = {
		primary: {
			url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
			alt: 'Front',
		},
		secondary: {
			url: '',
			alt: '',
			isBack: false,
		},
		hasShiny: false,
		hasFemale: false,
	}

	if (frontRes.status === 'fulfilled'){
		values.primary.url = frontRes.value.url ?? '';
		values.primary.alt = frontRes.value.alt;
		values.hasShiny = frontRes.value.hasShiny ? true : false,
		values.hasFemale = frontRes.value.hasFemale ? true : false;
	}

	if (backRes.status === 'fulfilled'){
		values.secondary.url = backRes.value.url ?? '',
		values.secondary.alt = backRes.value.alt
		values.secondary.isBack = backRes.value.isBack ? true : false
	}

	return values;
}

const easterEggs = (id: number, variety: string | null): Partial<IPokemonResponse> => {
	if (id !== 377){
		return {}
	}

	let returnValue: Partial<IPokemonResponse> = {
		pokemon: {
			varietyForms: [{name: 'regirock-normal'}, { name: 'regirock-cnty-regirock-with-a-handbag'}],
			types: [{ name: 'fairy'}],
		}
	} as Partial<IPokemonResponse>;

	if (variety === 'regirock-cnty-regirock-with-a-handbag'){
		returnValue = {
			...returnValue,
			sprites: {
				hasShiny: false,
				hasFemale: false,
				primary: {
					url: 'https://i.kym-cdn.com/entries/icons/original/000/049/483/cregcover.jpg',
					alt: 'Front'
				},
				secondary: {
					url: 'https://i.kym-cdn.com/entries/icons/original/000/049/483/cregcover.jpg',
					alt: 'Front',
					isBack: false,
				}
			}
		}
	}
	return returnValue;
}

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

	if (!species.has_gender_differences && requestPreferences.isFemale){
		requestPreferences.isFemale = false
	}

	const sprites = await fetchSprites(id, requestPreferences, platform)

	const formEntry = pokemon.forms.find((entry) => entry.name === variety);
	if (formEntry) {
		const formData = await fetchPokemonForm(formEntry.url, platform);
		species = {
			...species,
			names: formData.names
		};
	}

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
						pokemon: id,
						variety: varietyEntry.pokemon.name
					}
				)
			)
		}
	}

	const types = getPokemonTypesInGame(pokemon, selectedGame?.generation);

	const encounters = await fetchPokemonEncounters(id, platform);

	const easterEggData = easterEggs(id, variety);
	const response: IPokemonResponse = {
		id,
		pokemon: {
			...pokemon,
			abilities: fixAbilities(pokemon.past_abilities, pokemon.abilities, selectedGame),
			types,
			typeRelations: await getTypeRelations(selectedGame?.generation, types[0], types[1]),
			varietyForms: species.varieties
				.map((variety) => {
					return {
						name: variety.pokemon.name.includes('-')
							? variety.pokemon.name
							: variety.pokemon.name + '-default'
					};
				})
				.concat(pokemon.forms)
				.filter(
					(entry, index, arr) =>
						entry.name.includes('-') && arr.findIndex((e) => e.name === entry.name) === index
				),
			moves: formatMovesetToVersionEntries(pokemon.moves),
			...easterEggData?.pokemon
		},
		species: {
			...species,
			names: speciesNamesToNormalisedNames(species.names),
			flavor_text_entries: filterPokedexEntries(
				species.flavor_text_entries,
				primaryLanguage,
				secondaryLanguage
			)
		},
		encounters: formatEncounters(encounters),
		sprites: easterEggData?.sprites ?? sprites
	}

	return new Response(JSON.stringify(response), {
		headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=86400',
        },
	});
};
