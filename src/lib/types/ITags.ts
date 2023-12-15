export interface ITag {
	id: string;
	name: string;
	contents: ITagContents;
	isPrivate: boolean;
}

export interface ITagContents {
	pokemon: ITagPokemon[];
}

export interface ITagPokemon extends ITagPokemonNew {
	added: string;
}

export interface ITagPokemonNew {
	id: number;
	gender: 'female' | 'male';
	shiny: true | false | undefined;
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
