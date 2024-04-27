
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

	const allRespones = await Promise.allSettled(allPokemonMovePromises);
	const allSuccessful = allRespones.filter((res) => res.status === 'fulfilled');
	const allValues = await Promise.all(allSuccessful.map(async (res) =>{
		const parsed = await res.value.json() as IMove;
		return {
			url: res.value.url,
			...parsed
		}
	}
	));

	function matchMoveEntryWithAPI(staticMove: { level?: number; move: { name: string; url: string;} }): IPokemonMinimalMove{
		const matching = allValues.find((apiMove) => {
			return apiMove.url === staticMove.move.url;
		});

		return {
			id: matching?.id || -1,
			names: matching?.names || [],
			type: matching?.type || { name: 'Unknown', url: ''},
			damage_class: matching?.damage_class || { name: '', url: ''},
			level: staticMove?.level
		}
	}

	const mappedResponses: IPokemonMoveAPIResponse = {};
	allPokemonMoves.forEach((monEntry) => {
		const versionGroup = monEntry.versionGroup;
		mappedResponses[versionGroup] = {
			breedMoves: monEntry.breedMoves.map((move) => matchMoveEntryWithAPI(move)),
			levelupMoves: monEntry.levelupMoves.map((move) => matchMoveEntryWithAPI(move)),
			tmMoves: monEntry.tmMoves.map((move) => matchMoveEntryWithAPI(move)),
			tutorMoves: monEntry.tutorMoves.map((move) => matchMoveEntryWithAPI(move)),
		};
	});

	return new Response(JSON.stringify(mappedResponses), {
		status: 200, headers: {
			'Content-Type': 'application/json'
		}
	});
}

