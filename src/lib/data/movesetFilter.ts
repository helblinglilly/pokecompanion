import type { IPokemonMinimalMove } from '$/routes/api/pokemon/types';
import type { Moveset } from '$lib/types/IPokemon';
import StaticMoves from '$/lib/data/moves.json';

export interface IMoves {
	[key: string]: {
		levelupMoves: IPokemonMinimalMove[];
		tmMoves: IPokemonMinimalMove[];
		breedMoves: IPokemonMinimalMove[];
		tutorMoves: IPokemonMinimalMove[];
	}
}

export const formatMovesetToVersionEntries = (moves: Moveset[]): IMoves => {
	const entries: IMoves = {};

	moves
		.forEach((move) => {
			move.version_group_details.forEach((details) => {
				if (!entries[details.version_group.name]){
					entries[details.version_group.name] = {
						tutorMoves: [],
						breedMoves: [],
						levelupMoves: [],
						tmMoves: []
					}
				}

				const id = Number(move.move.url.split('/')[6] ?? -1);
				const moveEntry = StaticMoves.find((sMove) => sMove.id === id);
				const staticNames = moveEntry?.names ?? [];

				const names = [{
					language: {
						name: 'ja-Hrkt',
						url: ''
					},
					name: staticNames.find((name) => name['ja-hrkt'])?.['ja-hrkt'] ?? 'Loading',
				}, {
					language: {
						name: 'fr',
						url: ''
					},
					name: staticNames.find((name) => name['fr'])?.['fr'] ?? 'Loading',
				}, {
					language: {
						name: 'de',
						url: ''
					},
					name: staticNames.find((name) => name['de'])?.['de'] ?? 'Loading',
				}, {
					language: {
						name: 'en',
						url: ''
					},
					name: staticNames.find((name) => name['en'])?.['en'] ?? 'Loading',
				}, {
					language: {
						name: 'it',
						url: ''
					},
					name: staticNames.find((name) => name['it'])?.['it'] ?? 'Loading',
				},
				{
					language: {
						name: 'es',
						url: ''
					},
					name: staticNames.find((name) => name['es'])?.['es'] ?? 'Loading',
				}];
				const type = { 'name': 'normal', url: ''};
				const damage_class = { name: 'status', url: ''};

				if (details.move_learn_method.name === 'level-up') {
					entries[details.version_group.name].levelupMoves.push({
						level: details.level_learned_at,
						id,
						names,
						type,
						damage_class
					});
				} else if (details.move_learn_method.name === 'tutor') {
					entries[details.version_group.name].tutorMoves.push({ id,
						names,
						type,
						damage_class });
				} else if (details.move_learn_method.name === 'machine') {
					entries[details.version_group.name].tmMoves.push({ id,
						names,
						type,
						damage_class });
				} else if (details.move_learn_method.name === 'egg') {
					entries[details.version_group.name].breedMoves.push({ id,
						names,
						type,
						damage_class });
				}
			});
		});
	return entries;
};