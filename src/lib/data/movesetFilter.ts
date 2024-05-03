import type { Moveset } from '$lib/types/IPokemon';

interface IMove {
	name: string;
	url: string;
}

export interface IMoves {
	versionGroup: string;
	levelupMoves: {
		level: number;
		move: IMove;
	}[];
	tmMoves: {
		move: IMove;
	}[];
	breedMoves: {
		move: IMove;
	}[];
	tutorMoves: {
		move: IMove;
	}[];
}
export const filterMovesetByVersionEntry = (moves: Moveset[]): IMoves[] => {
	const entries: IMoves[] = [];

	moves
		.forEach((move) => {
			move.version_group_details.forEach((details) => {
				const hasExistingEntry = entries.some((entry) => {
					return entry.versionGroup === details.version_group.name;
				});

				if (!hasExistingEntry) {
					entries.push({
						versionGroup: details.version_group.name,
						levelupMoves: [],
						tmMoves: [],
						breedMoves: [],
						tutorMoves: []
					});
				}

				const existingEntry = entries.find((entry) => {
					return entry.versionGroup === details.version_group.name;
				});

				if (details.move_learn_method.name === 'level-up') {
					existingEntry?.levelupMoves.push({
						level: details.level_learned_at,
						move: move.move
					});
				} else if (details.move_learn_method.name === 'tutor') {
					existingEntry?.tutorMoves.push({ move: move.move });
				} else if (details.move_learn_method.name === 'machine') {
					existingEntry?.tmMoves.push({ move: move.move });
				} else if (details.move_learn_method.name === 'egg') {
					existingEntry?.breedMoves.push({ move: move.move });
				}
			});
		});

	return entries.filter((entry) => {
		return entry.breedMoves.length > 0 ||
			entry.levelupMoves.length > 0 ||
			entry.tmMoves.length > 0 ||
			entry.tutorMoves.length > 0
	})
};
