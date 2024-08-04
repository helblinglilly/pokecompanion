import type { RecordModel } from 'pocketbase';
import type { IRecordPokemon } from './IPokemon';

export interface ITag {
	id: string;
	name: string;
	contents: ITagContents;
	isPrivate: boolean;
	showGenderAndShiny: boolean;
	sortKey: 'added' | 'id' | 'alphabetical' | 'custom';
	sortOrder: 'asc' | 'desc' | 'custom';
	description: string;
	owner: string;
}

export interface ITagEntryGenerics {
	id: number;
	added: string;
}

export interface ITagContents {
	pokemon?: ITagPokemon[];
	move?: ITagMove[];
}

export type ITagPokemon = IRecordPokemon & ITagEntryGenerics;

export type ITagMove = ITagEntryGenerics;

export interface ITagRequestBody {
	name: string;
	isPrivate: boolean;
	initialContent?: ITagContents;
	showGenderAndShiny: boolean;
}

export interface ITagUpdateBody {
	updatedTags: ITag[];
}

export type TagRecord = ITag & RecordModel;
