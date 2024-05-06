import type { IEncounters } from "$lib/data/encounterFilter";
import type { ITypeRelations } from "$lib/data/generationAdjuster";
import type { IMoves } from "$lib/data/movesetFilter";
import type { IType } from "$lib/stores/pokemonPage";
import type { Ability, Form, ISprites, Name, Stat } from "$lib/types/IPokemon";

export interface IPokemonResponse {
	id: number;
	pokemon: {
		abilities: Ability[];
		types: IType[];
		typeRelations: ITypeRelations;
		varietyForms: {
			name: string;
		}[];
		moves: IMoves;
		base_experience: number;
		forms: Form[];
		stats: Stat[];
		sprites: ISprites;
	};
	species: {
		names: {
			[x: string]: string
		}[],
		flavor_text_entries: {
			language: string;
    		game: string;
    		textEntry: string;
		}[];
		evolution_chain: {
			url: string;
		}
	};
	encounters: IEncounters; 
};

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