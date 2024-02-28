import type { IGame } from '$lib/data/games';
import { pokeApiDomain } from '$lib/stores/domain';
import type { Name, VersionGroup } from './IPokemon';
import { logError } from '$lib/log';
import { error } from '@sveltejs/kit';
import type { IServerRequestDetails } from './IServerRequests';

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
	effect_entries: {
		effect: string;
		short_effect: string;
		language: {
			name: string;
			url: string;
		};
	}[];
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
	past_values: unknown[];
	power: unknown | null;
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

const legacyPhysicalTypes = [
	'normal',
	'fighting',
	'poison',
	'ground',
	'flying',
	'bug',
	'rock',
	'ghost',
	'steel'
];
const legacySpecialTypes = [
	'fire',
	'water',
	'electric',
	'grass',
	'ice',
	'physic',
	'dragon',
	'dark'
];

const getLegacyDamageClass = (existing: string, type: string) => {
	if (existing === 'status') {
		return 'status';
	}
	if (legacyPhysicalTypes.includes(type)) {
		return 'physical';
	}
	if (legacySpecialTypes.includes(type)) {
		return 'special';
	}
	return existing;
};

export async function getMove(
	id: string | number,
	selectedGame: IGame | undefined,
	serverRequest?: IServerRequestDetails
) {
	try {
		const response = await fetch(pokeApiDomain + `/move/${id}`);
		if (!response.ok) {
			throw new Error(`Non-200 status code - ${response.status}`);
		}
		const body = (await response.json()) as IMove;

		if (!selectedGame) {
			return body;
		}

		if (selectedGame.generation.number <= 3) {
			body.damage_class.name = getLegacyDamageClass(body.damage_class.name, body.type.name);
		}

		return body;
	} catch (err) {
		logError(`Failed to get Move API Data`, 'MoveLoadFailed', {
			requestUrl: `/move/${id}`,
			requestError: err,
			request: serverRequest?.request,
			cookies: serverRequest?.cookies
		});
		error(500, 'Failed to get Move API data');
	}
}
