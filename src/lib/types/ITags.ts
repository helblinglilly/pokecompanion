export interface ITag {
	id: string;
	name: string;
	contents: ITagContents;
	isPrivate: boolean;
	showGenderAndShiny: boolean;
}

export interface ITagContents {
	pokemon?: ITagPokemon[];
	move?: ITagMove[];
}

export interface ITagPokemon extends ITagPokemonNew {
	added?: string;
}

export interface ITagPokemonNew {
	id: number;
	gender?: 'female' | 'male' | undefined;
	shiny: true | false | undefined;
	variety?:
		| {
				spriteId: string | null;
				name: string | null;
		  }
		| undefined;
}

export interface ITagMove extends ITagMoveNew {
	added?: string;
}
export interface ITagMoveNew {
	id: number;
}

export interface ITagRequestBody {
	name: string;
	isPrivate: boolean;
	initialContent?: ITagContents;
	showGenderAndShiny: boolean;
}

export interface ITagUpdateBody {
	updatedTags: {
		id: string;
		name: string;
		contents: ITagContents;
		isPrivate: boolean;
		showGenderAndShiny: boolean;
	}[];
}
