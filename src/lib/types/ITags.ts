import type { RecordModel } from 'pocketbase';


export interface ITag {
	id: string;
	name: string;
	contents: ITagContents;
	isPrivate: boolean;
	isHiddenAcrossSite: boolean;
	showGenderAndShiny: boolean;
	sortKey: 'added' | 'id' | 'alphabetical' | 'custom';
	sortOrder: 'asc' | 'desc' | 'custom';
	description: string;
	owner: string;
}



export interface ITagRequestBody {
	name: string;
	isPrivate: boolean;
	initialContent?: ITagContents;
	showGenderAndShiny: boolean;
	isHiddenAcrossSite: boolean;
}

export interface ITagUpdateBody {
	updatedTags: ITag[];
}

export type TagRecord = ITag & RecordModel;
