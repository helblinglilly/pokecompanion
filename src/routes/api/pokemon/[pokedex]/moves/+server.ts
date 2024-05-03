
import { PokeapiVersionGroups } from '$/lib/data/games';
import adjustMoveForGame from '$/lib/gameAdjustors/move';
import { Logger } from '$/lib/log';
import { filterMovesetByVersionEntry } from '$lib/data/movesetFilter';
import type { IMove } from '$lib/types/IMoves';
import { fetchCacheFirst, fetchPokemon } from '../../cachedFetch';
import type { IPokemonMinimalMove, IPokemonMinimalMoveGroups } from '../../types';

export interface IPokemonMoveAPIResponse { [key: string]: IPokemonMinimalMoveGroups }

export async function GET({ platform, params }) {
	const pokedexId = Number(params.pokedex);

	const pokemon = await fetchPokemon(pokedexId, platform)

	const allPokemonMoves = filterMovesetByVersionEntry(pokemon.moves)

	const allPokemonMoveURLs: Set<string> = new Set();

	allPokemonMoves.forEach((moveEntry) => {
		moveEntry.breedMoves.forEach((move) => {
			allPokemonMoveURLs.add(move.move.url);
		});
		moveEntry.levelupMoves.forEach((move) => {
			allPokemonMoveURLs.add(move.move.url);
		});
		moveEntry.tmMoves.forEach((move) => {
			allPokemonMoveURLs.add(move.move.url);
		});
		moveEntry.tutorMoves.forEach((move) => {
			allPokemonMoveURLs.add(move.move.url);
		});
	})

	const allPokemonMovePromises = Array.from(allPokemonMoveURLs).map((url) => fetchCacheFirst(url, platform));

	Logger.info(`allPokemonMovePromisesLength: ${allPokemonMovePromises.length}`)

	const allRespones = await Promise.allSettled(allPokemonMovePromises);

	Logger.info(`allRespones length ${allRespones.length}`);

	const allSuccessful = allRespones.filter((res) => res.status === 'fulfilled');

	const allFailed = allRespones.filter((res) => res.status === 'rejected');

	Logger.info(`allSuccessful length ${allSuccessful.length}`);
	Logger.info(`allFailed length ${allFailed.length}`);

	allFailed.forEach((res) => {
		Logger.error(
			Logger.ErrorClasses.ExternalAPIRequestFailed,
			Logger.buildError(res.reason),
			{
				context: `/pokemon/${pokedexId}/move`
			}
		)
	})

	const allValues = await Promise.all(allSuccessful.map(async (res) =>{
		const parsed = await res.value.json() as IMove;
		return {
			url: res.value.url,
			...parsed
		}
	}
	)).catch((err) => {
		Logger.error(
			Logger.ErrorClasses.ExternalAPIRequestFailed,
			Logger.buildError(err),
			{
				context: `/pokemon/${params.pokedex}/moves`
			}
		);
		return [];
	});

	function matchMoveEntryWithAPI(staticMove: { level?: number; move: { name: string; url: string;} }, versionGroup: PokeapiVersionGroups): IPokemonMinimalMove{
		const matching = allValues.find((apiMove) => {
			return apiMove.url === staticMove.move.url;
		});
		
		if (!matching){
			return {
				id: Number(staticMove.move.url.split('/')[6] ?? -1),
				names: [{
					language: {
						name: 'ja-Hrkt',
						url: ''
					},
					name: 'Error'
				}, {
					language: {
						name: 'roomaji',
						url: ''
					},
					name: 'Error'
				}, {
					language: {
						name: 'ko',
						url: ''
					},
					name: 'Error'
				}, {
					language: {
						name: 'fr',
						url: ''
					},
					name: 'Error'
				}, {
					language: {
						name: 'de',
						url: ''
					},
					name: 'Error'
				}, {
					language: {
						name: 'fr',
						url: ''
					},
					name: 'Error'
				}, {
					language: {
						name: 'en',
						url: ''
					},
					name: 'Error'
				}, {
					language: {
						name: 'ja',
						url: ''
					},
					name: 'Error'
				}],
				type: { 'name': 'normal', url: ''},
				damage_class: { name: 'status', url: ''}
			}
		}

		const adjustedEntry = adjustMoveForGame(matching, versionGroup);

		return {
			id: adjustedEntry.id,
			names: adjustedEntry.names,
			type: adjustedEntry.type,
			damage_class: adjustedEntry.damage_class,
			level: staticMove?.level
		}
	}

	const mappedResponses: IPokemonMoveAPIResponse = {};
	allPokemonMoves.forEach((monEntry) => {
		const versionGroup = monEntry.versionGroup as PokeapiVersionGroups;
		mappedResponses[versionGroup] = {
			breedMoves: monEntry.breedMoves.map((move) => matchMoveEntryWithAPI(move, versionGroup)).filter((move) => move.id !== -1),
			levelupMoves: monEntry.levelupMoves.map((move) => matchMoveEntryWithAPI(move, versionGroup)).filter((move) => move.id !== -1),
			tmMoves: monEntry.tmMoves.map((move) => matchMoveEntryWithAPI(move, versionGroup)).filter((move) => move.id !== -1),
			tutorMoves: monEntry.tutorMoves.map((move) => matchMoveEntryWithAPI(move, versionGroup)).filter((move) => move.id !== -1),
		};
	});

	return new Response(JSON.stringify(mappedResponses), {
		status: 200, headers: {
			'Content-Type': 'application/json'
		}
	});
}

