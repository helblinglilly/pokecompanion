import type { RequestHandler } from "@sveltejs/kit";
import { fetchCacheFirst } from "../../cachedFetch";
import type { Platform } from "$/routes/api/types";
import type { IPokemon, IPokemonSpecies, ISprites } from "$/lib/types/IPokemon";

const baseUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon`;

async function respondWithImage(url: string, headers: object) {
	const response = await fetch(url);
	console.log(url, headers);
    const blob = await response.blob();

    return new Response(blob, {
        headers: { 
			'Content-Type': response.headers.get('Content-Type') || '',
			...headers
		},
    });
}

async function getPokemonFromVariety(id: number, variety: string | null, platform: Readonly<Platform> | undefined): Promise<{
	data: IPokemon | undefined,
	matchesVariety: boolean
}> {
	async function returnPlainPokmeon(didMatchVariety: boolean) {
		const res = await fetchCacheFirst(`https://pokeapi.co/api/v2/pokemon/${id}`, platform);
		if (!res.ok){
			return {
				data: undefined,
				matchesVariety: false,
			}
		}
		const data = await res.json() as IPokemon;
		return {
			data: data,
			matchesVariety: didMatchVariety
		}
	}


	try {
		if (!variety){
			return await returnPlainPokmeon(true);
		}
		// The species contains the variety information
		const speciesRes = await fetchCacheFirst(`https://pokeapi.co/api/v2/pokemon-species/${id}`, platform);
		if (!speciesRes.ok){
			return await returnPlainPokmeon(false);
		}
		const species = await speciesRes.json() as IPokemonSpecies;

		const speciesVariety = species.varieties.find((apiVariety) => apiVariety.pokemon.name === variety);
		if (!speciesVariety){
			return await returnPlainPokmeon(false);
		}

		const pokemonRes = await fetchCacheFirst(speciesVariety.pokemon.url, platform);
		if (!pokemonRes.ok){
			return await returnPlainPokmeon(false);
		}

		const data = await pokemonRes.json() as IPokemon;
		return {
			data: data,
			matchesVariety: true
		}
	} catch(err){
		return {
			data: undefined,
			matchesVariety: false
		}
	}
}

function getSpriteAndInfo(sprite: any, wantsShiny: boolean, wantsFemale: boolean, wantsBack: boolean){
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
			console.log(sprite);
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

	if (wantsFemale && wantsShiny){
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
	} else if (!wantsFemale && wantsShiny){
		if (sprite.front_shiny){
			return {
				url: sprite.front_shiny,
				hasShiny: true,
				hasFemale: Boolean(sprite.front_female_shiny),
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

function mergeObjects(obj1: Record<string, any>, obj2: Record<string, any>): Record<string, any> {
	const mergedObj = { ...obj1 };
	for (const key in obj2) {
		if (obj2[key] && obj2[key]) {
			mergedObj[key] = obj2[key];
		}
	}
	return mergedObj;
}

export const GET: RequestHandler = async ({ url, platform, params }) => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore Doesn't understand
	const id = params.pokedex as number;
	const ultimateFallback = baseUrl + `/${id}.png`;

	let matchesForm = false;

	const plainPokemon = await getPokemonFromVariety(id, url.searchParams.get('variety'), platform);
	if (!plainPokemon.data){
		return respondWithImage(ultimateFallback, {
			'Cache-Control': 'public, max-age=600, s-maxage=600',
			'X-Has-Female': false,
			'X-Has-Shiny': false,
			'X-Matches-Form': false,
			'X-Matches-Variety': false,
			'X-Is-Back': false,
		});
	}

	const form = url.searchParams.get('form');
	if (form){
		const matchingForm = plainPokemon.data.forms.find((apiForm) => apiForm.name === form);
		if (matchingForm){
			const formRes = await fetchCacheFirst(matchingForm.url, platform);
			if (formRes.ok){
				const data = await formRes.json() as IPokemon;
				plainPokemon.data.sprites = mergeObjects(plainPokemon.data, data.sprites) as ISprites;
				matchesForm = true;
			}
		}
	} else {
		matchesForm = true;
	}



	const wantsShiny = url.searchParams.get('shiny') === 'true';
	const wantsFemale = url.searchParams.get('gender') === 'female';
	const wantsBack = url.searchParams.get('direction') === 'back';
	const spriteInfo = getSpriteAndInfo(plainPokemon.data.sprites, wantsShiny, wantsFemale, wantsBack);

	if (!spriteInfo.url){
		return new Response(null, {
			status: 404
		})
	}

	const isPerfectMatch = (!wantsShiny || wantsShiny && spriteInfo.hasShiny) && 
		(!wantsFemale || wantsFemale && spriteInfo.hasFemale) && 
		(!wantsBack || wantsBack && spriteInfo.isBack) &&
		matchesForm && 
		plainPokemon.matchesVariety;

	return respondWithImage(spriteInfo.url, {
		'Cache-Control': `public, max-age=${isPerfectMatch ? 86400 : 600}, s-maxage=${isPerfectMatch ? 86400 : 600}`,
		'X-Has-Female': spriteInfo.hasFemale,
		'X-Has-Shiny': spriteInfo.hasShiny,
		'X-Matches-Form': matchesForm,
		'X-Is-Back': spriteInfo.isBack,
		'X-Matches-Variety': plainPokemon.matchesVariety,
	},
);
};