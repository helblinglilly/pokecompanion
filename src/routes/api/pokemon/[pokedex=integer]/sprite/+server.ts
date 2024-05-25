import type { RequestHandler } from "@sveltejs/kit";
import { fetchCacheFirst } from "../../cachedFetch";
import type { Platform } from "$/routes/api/types";
import type { IPokemon, IPokemonSpecies, ISprites } from "$/lib/types/IPokemon";
import { getGameGroupFromName } from "$/lib/data/games";
import type { UserPreferencePokemonVersion } from "$/lib/stores/domain";
import { getSpriteAndInfo, getSpriteForGameAnimation } from "./helper";
import { capitaliseEachWord } from "$/lib/utils/string";

const baseUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon`;

async function respond(url: string, respondImage: boolean, headers: object) {
	if (respondImage){
		const response = await fetch(url);
		const blob = await response.blob();
	
		return new Response(blob, {
			headers: { 
				'Content-Type': response.headers.get('Content-Type') || '',
				...headers
			},
		});
	}
	return new Response(url, { headers: { 
		'Content-Type': 'text/plain',
		...headers
	}
	})
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
	const respondWithImage = url.searchParams.get('image') === 'true';

	let matchesForm = false;

	const plainPokemon = await getPokemonFromVariety(id, url.searchParams.get('variety'), platform);
	if (!plainPokemon.data){
		return respond(ultimateFallback, respondWithImage, {
			'Cache-Control': 'public, max-age=600, s-maxage=600',
			'X-Has-Female': false,
			'X-Has-Shiny': false,
			'X-Matches-Form': false,
			'X-Matches-Variety': false,
			'X-Is-Back': false,
			'X-Alt-Text': `Front`,
		});
	}

	const variety = url.searchParams.get('variety');
	if (variety){
		const matchingForm = plainPokemon.data.forms.find((apiForm) => apiForm.name === variety);
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
	const selectedGame = getGameGroupFromName(url.searchParams.get('game') as UserPreferencePokemonVersion);
	const showAnimated = url.searchParams.get('animate') === 'true';

	const gameAnimationSpecificSprites = getSpriteForGameAnimation(plainPokemon.data, selectedGame, showAnimated);

	const spriteInfo = getSpriteAndInfo(
		gameAnimationSpecificSprites,
		wantsShiny, 
		wantsFemale, 
		wantsBack
	);
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


	return respond(spriteInfo.url, respondWithImage, {
		'Cache-Control': `public, max-age=${isPerfectMatch ? 86400 : 600}, s-maxage=${isPerfectMatch ? 86400 : 600}`,
		'X-Has-Female': spriteInfo.hasFemale,
		'X-Has-Shiny': spriteInfo.hasShiny,
		'X-Matches-Form': matchesForm,
		'X-Is-Back': spriteInfo.isBack,
		'X-Matches-Variety': plainPokemon.matchesVariety,
		'X-Alt-Text': `${spriteInfo.isBack ? 'Back' : 'Front'}${wantsShiny && spriteInfo.hasShiny ? ' Shiny' : ''}${wantsFemale && spriteInfo.hasFemale ? ' Female' : ''}${variety ? ` ${capitaliseEachWord(variety.replaceAll('-', ' '))}`  : ''}`,
	},
);
};