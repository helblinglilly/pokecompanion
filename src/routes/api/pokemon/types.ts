import type { IGameGroups } from '$/lib/data/games';
import type { IEncounters } from '$lib/data/encounterFilter';
import type { IMoves } from '$lib/data/movesetFilter';
import type { Form, Name, Stat } from '$lib/types/IPokemon';

export interface IPokemonResponse {
	id: number;
	pokemon: {
		cries: {
			latest: string | null;
			legacy: string | null;
		};
		name: string;
		varietyForms: {
			name: string;
		}[];
		moves: IMoves;
		base_experience: number;
		forms: Form[];
		stats: Stat[];
		height: number;
		weight: number;
	};
	species: {
		names: {
			[x: string]: string;
		}[];
		evolution_chain: {
			url: string;
		};
	};
	encounters: IEncounters;
}

export interface IPokemonMinimalMove {
	id: number;
	names: Name[];
	type: {
		name: string;
		url: string;
	};
	damage_class: {
		name: string;
		url: string;
	};
	level?: number | undefined;
}

export interface IPokemonMinimalMoveGroups {
	breedMoves: IPokemonMinimalMove[];
	levelupMoves: IPokemonMinimalMove[];
	tmMoves: IPokemonMinimalMove[];
	tutorMoves: IPokemonMinimalMove[];
}

export interface IPokemonRequestPreferences {
	variety: string | null;
	shiny: boolean;
	isFemale: boolean;
	primaryLanguage: string;
	secondaryLanguage: string | undefined;
	selectedGame: IGameGroups | undefined;
	animateSprites: boolean;
}

export interface ISpritesConsumable {
	primary: {
		url: string;
		alt: string;
	};
	secondary: {
		url: string;
		alt: string;
		isBack: boolean;
	};
	hasFemale: boolean;
	hasShiny: boolean;
}
