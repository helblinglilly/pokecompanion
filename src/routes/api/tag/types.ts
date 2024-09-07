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
    contents: ITagContents;
}

export interface ITagDatabase extends ITagInitial {
    id: string;
    sortKey: 'id' | 'added' | 'alphabetical' | 'custom';
    sortOrder: 'asc' | 'desc' | 'custom';
    owner: string;
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

export type ITagMove = ITagEntryGenerics;

export type RecordTag = ITagDatabase & RecordModel & {
    added: string;
    updated: string;
};