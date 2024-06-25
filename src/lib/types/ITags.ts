import type { RecordModel } from 'pocketbase';

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

export type ITagPokemon = ITagPokemonNew & ITagEntryGenerics;

export interface ITagPokemonNew {
	id: number;
	gender?: 'female' | 'male' | undefined;
	shiny: true | false | undefined;
	variety?: string;
}

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
