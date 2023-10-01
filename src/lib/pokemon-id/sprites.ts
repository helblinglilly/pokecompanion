import type { ISprites } from '$lib/types/IPokemon';

interface ISpriteData {
	default: string;
	shiny?: string | null;
	shinyFemale?: string | null;
	female?: string | null;
	grey?: string | null;
}

export const findBaseSprites = (
	sprites: ISprites,
	versionSpecificSprites: boolean,
	selectedGame: string | undefined,
	animatedSprites: boolean
): {
	primary: ISpriteData;
	secondary: ISpriteData;
} => {
	if (versionSpecificSprites && selectedGame) {
		if (selectedGame === 'red-blue' && sprites.versions['generation-i']) {
			return {
				primary: {
					default: sprites.versions['generation-i']['red-blue'].front_transparent,
					grey: sprites.versions['generation-i']['red-blue'].front_gray
				},
				secondary: {
					default: sprites.versions['generation-i']['red-blue'].back_transparent,
					grey: sprites.versions['generation-i']['red-blue'].back_gray
				}
			};
		} else if (selectedGame === 'yellow' && sprites.versions['generation-i']) {
			return {
				primary: {
					default: sprites.versions['generation-i']['yellow'].front_transparent,
					grey: sprites.versions['generation-i']['yellow'].front_gray
				},
				secondary: {
					default: sprites.versions['generation-i']['yellow'].back_transparent,
					grey: sprites.versions['generation-i']['yellow'].back_gray
				}
			};
		} else if (selectedGame === 'gold-silver' && sprites.versions['generation-ii']) {
			return {
				primary: {
					default: sprites.versions['generation-ii'].gold.front_default,
					shiny: sprites.versions['generation-ii'].gold.front_shiny
				},
				secondary: {
					default: sprites.versions['generation-ii'].gold.back_default,
					shiny: sprites.versions['generation-ii'].gold.back_shiny
				}
			};
		} else if (selectedGame === 'crystal' && sprites.versions['generation-ii']) {
			return {
				primary: {
					default: sprites.versions['generation-ii'].crystal.front_default,
					shiny: sprites.versions['generation-ii'].crystal.front_shiny
				},
				secondary: {
					default: sprites.versions['generation-ii'].crystal.back_default,
					shiny: sprites.versions['generation-ii'].crystal.back_shiny
				}
			};
		} else if (selectedGame === 'ruby-sapphire' && sprites.versions['generation-iii']) {
			return {
				primary: {
					default: sprites.versions['generation-iii']['ruby-sapphire'].front_default,
					shiny: sprites.versions['generation-iii']['ruby-sapphire'].front_shiny
				},
				secondary: {
					default: sprites.versions['generation-iii']['ruby-sapphire'].back_default,
					shiny: sprites.versions['generation-iii']['ruby-sapphire'].back_shiny
				}
			};
		} else if (selectedGame === 'emerald' && sprites.versions['generation-iii']) {
			return {
				primary: {
					default: sprites.versions['generation-iii']['emerald'].front_default,
					shiny: sprites.versions['generation-iii']['emerald'].front_shiny
				},
				secondary: {
					default: sprites.back_default ?? '',
					shiny: sprites.back_shiny
				}
			};
		} else if (selectedGame === 'diamond-pearl' && sprites.versions['generation-iv']) {
			return {
				primary: {
					default: sprites.versions['generation-iv']['diamond-pearl'].front_default,
					shiny: sprites.versions['generation-iv']['diamond-pearl'].front_shiny,
					female: sprites.versions['generation-iv']['diamond-pearl'].front_female,
					shinyFemale: sprites.versions['generation-iv']['diamond-pearl'].front_shiny_female
				},
				secondary: {
					default: sprites.versions['generation-iv']['diamond-pearl'].back_default,
					shiny: sprites.versions['generation-iv']['diamond-pearl'].back_shiny,
					female: sprites.versions['generation-iv']['diamond-pearl'].back_female,
					shinyFemale: sprites.versions['generation-iv']['diamond-pearl'].back_shiny_female
				}
			};
		} else if (selectedGame === 'platinum' && sprites.versions['generation-iv']) {
			return {
				primary: {
					default: sprites.versions['generation-iv'].platinum.front_default,
					shiny: sprites.versions['generation-iv'].platinum.front_shiny,
					female: sprites.versions['generation-iv'].platinum.front_female,
					shinyFemale: sprites.versions['generation-iv'].platinum.front_shiny_female
				},
				secondary: {
					default: sprites.versions['generation-iv'].platinum.back_default,
					shiny: sprites.versions['generation-iv'].platinum.back_shiny,
					female: sprites.versions['generation-iv'].platinum.back_female,
					shinyFemale: sprites.versions['generation-iv'].platinum.back_shiny_female
				}
			};
		} else if (selectedGame === 'heartgold-soulsilver' && sprites.versions['generation-iv']) {
			return {
				primary: {
					default: sprites.versions['generation-iv']['heartgold-soulsilver'].front_default,
					shiny: sprites.versions['generation-iv']['heartgold-soulsilver'].front_shiny,
					female: sprites.versions['generation-iv']['heartgold-soulsilver'].front_female,
					shinyFemale: sprites.versions['generation-iv']['heartgold-soulsilver'].front_shiny_female
				},
				secondary: {
					default: sprites.versions['generation-iv']['heartgold-soulsilver'].back_default,
					shiny: sprites.versions['generation-iv']['heartgold-soulsilver'].back_shiny,
					female: sprites.versions['generation-iv']['heartgold-soulsilver'].back_female,
					shinyFemale: sprites.versions['generation-iv']['heartgold-soulsilver'].back_shiny_female
				}
			};
		} else if (
			(selectedGame === 'black-white' || selectedGame === 'black2-white2') &&
			sprites.versions['generation-v']
		) {
			if (animatedSprites) {
				return {
					primary: {
						default: sprites.versions['generation-v']['black-white'].animated.front_default,
						shiny: sprites.versions['generation-v']['black-white'].animated.front_shiny,
						female: sprites.versions['generation-v']['black-white'].animated.front_female,
						shinyFemale: sprites.versions['generation-v']['black-white'].animated.front_shiny_female
					},
					secondary: {
						default: sprites.versions['generation-v']['black-white'].animated.back_default,
						shiny: sprites.versions['generation-v']['black-white'].animated.back_shiny,
						female: sprites.versions['generation-v']['black-white'].animated.back_female,
						shinyFemale: sprites.versions['generation-v']['black-white'].animated.back_shiny_female
					}
				};
			}
			return {
				primary: {
					default: sprites.versions['generation-v']['black-white'].front_default,
					shiny: sprites.versions['generation-v']['black-white'].front_shiny,
					female: sprites.versions['generation-v']['black-white'].front_female,
					shinyFemale: sprites.versions['generation-v']['black-white'].front_shiny_female
				},
				secondary: {
					default: sprites.versions['generation-v']['black-white'].back_default,
					shiny: sprites.versions['generation-v']['black-white'].back_shiny,
					female: sprites.versions['generation-v']['black-white'].back_female,
					shinyFemale: sprites.versions['generation-v']['black-white'].back_shiny_female
				}
			};
		} else if (selectedGame === 'x-y' && sprites.versions['generation-vi']) {
			return {
				primary: {
					default: sprites.versions['generation-vi']['x-y'].front_default,
					shiny: sprites.versions['generation-vi']['x-y'].front_shiny,
					female: sprites.versions['generation-vi']['x-y'].front_female,
					shinyFemale: sprites.versions['generation-vi']['x-y'].front_shiny_female
				},
				secondary: {
					default: sprites.back_default ?? '',
					shiny: sprites.back_shiny,
					female: sprites.back_female,
					shinyFemale: sprites.back_shiny_female
				}
			};
		} else if (selectedGame === 'omegaruby-alphasapphire' && sprites.versions['generation-vi']) {
			return {
				primary: {
					default: sprites.versions['generation-vi']['omegaruby-alphasapphire'].front_default,
					shiny: sprites.versions['generation-vi']['omegaruby-alphasapphire'].front_shiny,
					female: sprites.versions['generation-vi']['omegaruby-alphasapphire'].front_female,
					shinyFemale:
						sprites.versions['generation-vi']['omegaruby-alphasapphire'].front_shiny_female
				},
				secondary: {
					default: sprites.back_default ?? '',
					shiny: sprites.back_shiny,
					female: sprites.back_female,
					shinyFemale: sprites.back_shiny_female
				}
			};
		} else if (
			(selectedGame === 'sun-moon' || selectedGame === 'ultrasun-ultramoon') &&
			sprites.versions['generation-vii']
		) {
			return {
				primary: {
					default: sprites.versions['generation-vii']['ultra-sun-ultra-moon'].front_default,
					shiny: sprites.versions['generation-vii']['ultra-sun-ultra-moon'].front_shiny,
					female: sprites.versions['generation-vii']['ultra-sun-ultra-moon'].front_female,
					shinyFemale: sprites.versions['generation-vii']['ultra-sun-ultra-moon'].front_shiny_female
				},
				secondary: {
					default: sprites.back_default ?? '',
					shiny: sprites.back_shiny,
					female: sprites.back_female,
					shinyFemale: sprites.back_shiny_female
				}
			};
		}
	}

	// Generations 8 and 9 only have icons so far
	return {
		primary: {
			default: sprites.front_default,
			shiny: sprites.front_shiny,
			female: sprites.front_female,
			shinyFemale: sprites.front_shiny_female
		},
		secondary: {
			default: sprites.back_default ?? '',
			shiny: sprites.back_shiny,
			female: sprites.back_female,
			shinyFemale: sprites.back_shiny_female
		}
	};
};

export interface ISpriteImage {
	url: string;
	alt: string;
}

export const findPrimarySprite = (
	passedSprites: { primary: ISpriteData; secondary: ISpriteData },
	isDisplayingFemale: boolean,
	isDisplayingShiny: boolean
): ISpriteImage => {
	if (isDisplayingFemale && passedSprites.primary.female) {
		if (isDisplayingShiny && passedSprites.primary.shinyFemale) {
			return { url: passedSprites.primary.shinyFemale, alt: 'Shiny Female Front' };
		} else {
			return { url: passedSprites.primary.female, alt: 'Female Front' };
		}
	} else {
		if (isDisplayingShiny && passedSprites.primary.shiny) {
			return { url: passedSprites.primary.shiny, alt: 'Shiny Front' };
		}
		return { url: passedSprites.primary.default, alt: 'Front' };
	}
};

export const findSecondarySprite = (
	passedSprites: { primary: ISpriteData; secondary: ISpriteData },
	isDisplayingFemale: boolean,
	isDisplayingShiny: boolean
): ISpriteImage => {
	if (isDisplayingFemale && passedSprites.secondary.female) {
		if (isDisplayingShiny && passedSprites.secondary.shinyFemale) {
			return { url: passedSprites.secondary.shinyFemale, alt: 'Shiny Female Back' };
		} else {
			return { url: passedSprites.secondary.female, alt: 'Female Back' };
		}
	} else {
		if (isDisplayingShiny && passedSprites.secondary.shiny) {
			return { url: passedSprites.secondary.shiny, alt: 'Shiny Back' };
		}
		return { url: passedSprites.secondary.default, alt: 'Back' };
	}
};
