import type { IRecordPokemon } from '$/lib/types/IPokemon';
import type { ITagMove } from './api.pokecompanion';

export interface ITagMeta {
	description: string;
	isHiddenAcrossSite: boolean;
	isPrivate: boolean;
	name: string;
	showGenderAndShiny: boolean;
}

export interface ITagDatabase extends ITagMeta {
	id: string;
	sortKey: 'id' | 'added' | 'alphabetical' | 'custom';
	sortOrder: 'asc' | 'desc' | 'custom';
	owner: string;
	contents: ITagContents;
}

export interface ITagContents {
	pokemon?: ITagPokemon[];
	move?: ITagMove[];
}

export interface ITagEntryGenerics {
	id: number;
	added: string;
}

export type ITagPokemon = IRecordPokemon & ITagEntryGenerics;
