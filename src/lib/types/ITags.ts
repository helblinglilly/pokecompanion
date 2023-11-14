export interface ITag {
	id: string;
	name: string;
	contents: ITagContents;
	isPrivate: boolean;
}

export interface ITagContents {
	pokemon: {
		id: number;
	}[];
}

export interface ITagRequestBody {
	name: string;
	isPrivate: boolean;
	initialContent?: ITagContents;
}

export interface ITagUpdateBody {
	updatedTags: {
		id: string;
		name: string;
		contents: ITagContents;
		isPrivate: boolean;
	}[];
}
