import type { IRecordPokemon } from "$/lib/types/IPokemon";
import type { RecordModel } from "pocketbase";

export interface ITagMeta {
    description: string;
    isHiddenAcrossSite: boolean;
    isPrivate: boolean;
    name: string;
    showShinyAndGender: boolean;
}

export interface ITagInitial extends ITagMeta {
    contents: ITagContentsInitial;
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
export type ITagMoveInitial = Omit<ITagMove, 'added'>

export type RecordTag = ITagDatabase & RecordModel & {
    added: string;
    updated: string;
};