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
