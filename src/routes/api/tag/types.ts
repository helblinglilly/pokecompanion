import type { IRecordPokemon } from '$/lib/types/IPokemon';

export interface ITagMeta {
	description: string;
	isHiddenAcrossSite: boolean;
	isPrivate: boolean;
	name: string;
	showShinyAndGender: boolean;
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

export interface ITagContentsInitial {
	pokemon?: ITagPokemonInitial[];
	move?: ITagMoveInitial[];
}

export interface ITagEntryGenerics {
	id: number;
	added: string;
}

export type ITagPokemon = IRecordPokemon & ITagEntryGenerics;
export type ITagPokemonInitial = Omit<ITagPokemon, 'added'>;

export type ITagMove = ITagEntryGenerics;
export type ITagMoveInitial = Omit<ITagMove, 'added'>;
