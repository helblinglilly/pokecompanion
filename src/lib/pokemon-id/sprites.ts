import type { ISprites } from '$lib/apiTypes';

export const findBaseSprites = (sprites: ISprites) => {
	// if ($versionSpecificSprites && $selectedGame) {
	// 	// Find correct version in sprites and assign to spriteBase
	// 	return sprites;
	// }
	return sprites;
};

export interface ISpriteImage {
	url: string;
	alt: string;
}
export const findPrimarySprite = (
	passedSprites: ISprites,
	hasFemale: boolean,
	isDisplayingFemale: boolean,
	hasShiny: boolean,
	isDisplayingShiny: boolean
): ISpriteImage => {
	if (hasFemale && isDisplayingFemale) {
		if (hasShiny && isDisplayingShiny) {
			return { url: passedSprites.front_shiny_female ?? '', alt: 'Shiny Female Front' };
		} else {
			return { url: passedSprites.front_female ?? '', alt: 'Female Front' };
		}
	} else {
		if (hasShiny && isDisplayingShiny) {
			return { url: passedSprites.front_shiny, alt: 'Shiny Front' };
		}
		return { url: passedSprites.front_default, alt: 'Front' };
	}
};

export const findSecondarySprite = (
	passedSprites: ISprites,
	hasFemale: boolean,
	isDisplayingFemale: boolean,
	hasShiny: boolean,
	isDisplayingShiny: boolean
): ISpriteImage => {
	if (hasFemale && isDisplayingFemale) {
		if (hasShiny && isDisplayingShiny) {
			return { url: passedSprites.back_shiny_female ?? '', alt: 'Shiny Female Back' };
		} else {
			return { url: passedSprites.back_female ?? '', alt: 'Female Back' };
		}
	} else {
		if (hasShiny && isDisplayingShiny) {
			return { url: passedSprites.back_shiny ?? '', alt: 'Shiny Back' };
		}
		return { url: passedSprites.back_default ?? '', alt: 'Back' };
	}
};
