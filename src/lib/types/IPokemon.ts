import type { PokeapiVersionGroups } from '$/@types/api.pokecompanion';

export interface IRecordPokemon {
	id: number;
	gender?: 'female' | 'male' | undefined;
	shiny: true | false | undefined;
	variety?: string;
}

export interface VersionGroup {
	name: PokeapiVersionGroups;
	url: string;
}

export interface Name {
	language: {
		name: string;
		url: string;
	};
	name: string;
}
