import type { IGameGroups } from '$lib/data/games';
import { pokeApiDomain } from '$lib/stores/domain';
import type { Name, VersionGroup } from './IPokemon';
import { error } from '@sveltejs/kit';
import { Logger } from '$lib/log';
import adjustMoveForGame from '../gameAdjustors/move';
import type { PokeapiVersionGroups } from '$/@types/api.pokecompanion';

interface IEffectEntries {
	effect: string;
	short_effect: string;
	language: {
		name: string;
		url: string;
	};
}

export interface IMove {
	accuracy: number | null;
	contest_combos: {
		normal: {
			use_after: unknown | null;
			use_before: {
				name: string;
				url: string;
			}[];
		};
	};
	contest_effect: {
		url: string;
	};
	contest_type: {
		name: string;
		url: string;
	};
	damage_class: {
		name: string;
		url: string;
	};
	effect_chance: number;
	effect_changes: unknown[];
	effect_entries: IEffectEntries[];
	flavor_text_entries: {
		flavor_text: string;
		language: {
			name: string;
			url: string;
		};
		version_group: {
			name: string;
			url: string;
		};
	}[];
	generation: {
		name: string;
		url: string;
	};
	id: number;
	learned_by_pokemon: {
		name: string;
		url: string;
	}[];
	machines: {
		machine: {
			name: string;
			url: string;
		};
		version_group: VersionGroup;
	}[];
	meta: {
		ailment: {
			name: string;
			url: string;
		};
		ailment_chance: number;
		category: {
			name: string;
			url: string;
		};
		crit_rate: number;
		drain: number;
		flinch_chance: number;
		healing: number;
		max_hits: number;
		max_turns: number;
		min_hits: number;
		min_turns: number;
		stat_chance: number;
	};
	name: string;
	names: Name[];
	past_values: {
		accuracy: number | null;
		effect_chance: number | null;
		effect_entries: IEffectEntries[];
		power: number | null;
		pp: number | null;
		type: {
			name: string;
			url: string;
		} | null;
		version_group: {
			name: PokeapiVersionGroups;
			url: string;
		};
	}[];
	power: number | null;
	pp: number;
	priority: number;
	stat_changes: unknown[];
	super_contest_effect: {
		url: string;
	};
	target: {
		name: string;
		url: string;
	};
	type: {
		name: string;
		url: string;
	};
}

export async function getMove(id: string | number, selectedGame: IGameGroups | undefined) {
	const url = `${pokeApiDomain}/move/${id}`;
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Non-200 status code - ${response.status}`);
		}
		const body = (await response.json()) as IMove;

		if (!selectedGame) {
			return body;
		}

		return adjustMoveForGame(body, selectedGame.pokeapi);
	} catch (err) {
		await Logger.error(Logger.ErrorClasses.ExternalAPIRequestFailed, Logger.buildError(err), {
			context: 'Failed to get Move API Data',
			url
		});
		error(500, 'Failed to get Move API data');
	}
}
