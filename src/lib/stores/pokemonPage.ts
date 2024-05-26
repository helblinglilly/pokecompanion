import { writable } from 'svelte/store';

export interface IType {
	name: string;
	icon: string;
	url: string;
}

export interface IDisplayPokemon {
	id: number;

	hasFemaleSprite: boolean;
	showFemaleSpriteIfExists: boolean;

	hasShinySprite: boolean;
	showShinySpriteIfExists: boolean;

	gender: 'male' | 'female' | undefined;

	transferableQueryParams: string;

	variety: string | undefined;
}

export const pokemonDisplayStore = writable<IDisplayPokemon>();

let isUpdating = false;
pokemonDisplayStore.subscribe((currentValue) => {
	if (isUpdating) {
        isUpdating = false;
        return;
    }

	const newQueryParams = new URLSearchParams();

	currentValue = {
		...currentValue,
		transferableQueryParams: '',
	}

	if (currentValue){
		if (currentValue.showFemaleSpriteIfExists && !currentValue.transferableQueryParams.includes('gender=female')){
			newQueryParams.set('gender', 'female');
		} else {
			newQueryParams.delete('gender');
		}
	
		if (currentValue.showShinySpriteIfExists && !currentValue.transferableQueryParams.includes('shiny=true')){
			newQueryParams.set('shiny', 'true');
		} else {
			newQueryParams.delete('shiny');
		}

		const newString = newQueryParams.size > 0 ? `?${newQueryParams.toString()}` : '';
	
		currentValue.transferableQueryParams = newString;
	}
	
	isUpdating = true;
    pokemonDisplayStore.set(currentValue);
});