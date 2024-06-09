import { PokeapiVersionGroups, PokeapiVersionNames, type IGameGroups } from "$/lib/data/games";
import type { IPokemon, ISprites } from "$/lib/types/IPokemon";

export function getSpriteAndInfo(sprite: any, wantsShiny: boolean, wantsFemale: boolean, wantsBack: boolean){
	if (wantsBack){
		if (wantsFemale && wantsShiny){
			if (sprite.back_shiny_female){
				return {
					url: sprite.back_shiny_female,
					hasShiny: true,
					hasFemale: true,
					isBack: true
				}
			} else if (sprite.back_shiny){
				return {
					url: sprite.back_shiny,
					hasShiny: true,
					hasFemale: false,
					isBack: true
				}
			} else if (sprite.back_female){
				return {
					url: sprite.back_female,
					hasShiny: false,
					hasFemale: true,
					isBack: true
				}
			} else {
				return {
					url: sprite.back_default ?? '',
					hasShiny: false,
					hasFemale: false,
					isBack: false
				}
			}
		} else if (!wantsFemale && wantsShiny){
			if (sprite.back_shiny){
				return {
					url: sprite.back_shiny,
					hasShiny: true,
					hasFemale: Boolean(sprite.back_shiny_female),
					isBack: true
				}
			} else {
				return {
					url: undefined,
					hasShiny: false,
					hasFemale: Boolean(sprite.back_shiny_female),
					isBack: false
				}
			}
		} else if (wantsFemale && !wantsShiny){
			if (sprite.back_female){
				return {
					url: sprite.back_female,
					hasShiny: Boolean(sprite.back_shiny_female),
					hasFemale: true,
					isBack: true
				}
			} else {
				return {
					url: sprite.back_default ?? '',
					hasShiny: false,
					hasFemale: false,
					isBack: true
				}
			}
		} else if (!wantsFemale && !wantsShiny){
			if (sprite.back_default){
				return {
					url: sprite.back_default,
					hasShiny: Boolean(sprite.back_shiny),
					hasFemale: Boolean(sprite.back_female),
					isBack: true
				}
			} else {
				return {
					url: '',
					hasShiny: false,
					hasFemale: false,
					isBack: false
				}
			}
		} 
	}

	if (wantsFemale){
		if (wantsShiny){
			if (sprite.front_shiny_female){
				return {
					url: sprite.front_shiny_female,
					hasShiny: true,
					hasFemale: true,
					isBack: false
				}
			} else if (sprite.front_shiny){
				return {
					url: sprite.front_shiny,
					hasShiny: true,
					hasFemale: false,
					isBack: false
				}
			} else if (sprite.front_female){
				return {
					url: sprite.front_female,
					hasShiny: false,
					hasFemale: true,
					isBack: false
				}
			}
		} else {
			if (sprite.front_female){
				return {
					url: sprite.front_female,
					hasShiny: Boolean(sprite.front_shiny_female),
					hasFemale: true,
					isBack: false
				}
			} else {
				return {
					url: sprite.front_default,
					hasShiny: Boolean(sprite.front_shiny),
					hasFemale: false,
					isBack: false
				}
			}
		}
	} else if (!wantsFemale && wantsShiny){
		if (sprite.front_shiny){
			return {
				url: sprite.front_shiny,
				hasShiny: true,
				hasFemale: Boolean(sprite.front_shiny_female),
				isBack: false
			}
		}
	}

	return {
		url: sprite.front_default ?? '',
		hasShiny: Boolean(sprite.front_shiny),
		hasFemale: Boolean(sprite.front_female),
		isBack: false
	}
}

export function getSpriteForGameAnimation(pokemon: IPokemon, selectedGame: IGameGroups | undefined, showAnimated: boolean){
    let specificGameSprites: undefined | ISprites;
	let animatedGameSprites: undefined | ISprites;
    
    if (selectedGame){
        let pokeapiSpriteName: PokeapiVersionNames | PokeapiVersionGroups = selectedGame.pokeapi;
    
        if (selectedGame.pokeapi === PokeapiVersionGroups.BLACK_2_WHITE_2){
            pokeapiSpriteName = PokeapiVersionGroups.BLACK_WHITE;
        } else if (selectedGame.pokeapi === PokeapiVersionGroups.GOLD_SILVER){
            pokeapiSpriteName = PokeapiVersionNames.GOLD;
        } else if (selectedGame.pokeapi === PokeapiVersionGroups.SUN_MOON){
			pokeapiSpriteName = PokeapiVersionGroups.ULTRA_SUN_ULTRA_MOON
		}

		if (selectedGame.pokeapi === PokeapiVersionGroups.HOME){
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
        	// @ts-ignore TODO: Can't be asked to type this properly
			specificGameSprites = pokemon.sprites?.other?.home ?? undefined;
		} else {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
        	// @ts-ignore TODO: Can't be asked to type this properly
			const generationSpecific = pokemon.sprites.versions ? pokemon.sprites.versions[selectedGame.generation.pokeApiName] : undefined

			if (selectedGame.generation.number === 6 && showAnimated){
				const possiblyAnimated = pokemon.sprites?.other?.showdown ?? undefined;
				if (possiblyAnimated){
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
        			// @ts-ignore TODO: Can't be asked to type this properly
					specificGameSprites = possiblyAnimated;
				}
			} else {
				if (generationSpecific){
					if (generationSpecific[pokeapiSpriteName]){
						specificGameSprites = generationSpecific[pokeapiSpriteName]
					}
				}
			}
		}

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore TODO: Can't be asked to type this properly
        if (showAnimated === true && specificGameSprites?.animated){
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore TODO: Can't be asked to type this properly
            animatedGameSprites = specificGameSprites?.animated;
        }
    }

    if (animatedGameSprites){
        return animatedGameSprites;
    }
    if (specificGameSprites){
        return specificGameSprites;
    }
    return pokemon.sprites
}