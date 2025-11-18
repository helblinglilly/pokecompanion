import { type IGameGroups } from '$/lib/data/games';
import { fetchCacheFirst } from '$/lib/server/cachedFetch/core';
import type { IPokemon, IPokemonSpecies, ISprites } from '$/lib/types/IPokemon';
import { capitaliseEachWord } from '$/lib/utils/string';
import type { Platform } from '$/routes/api/types';
import { getSpriteAndInfo, getSpriteForGameAnimation } from './helper';
import type { SelfHostedSprite } from './selfHosted';
import { SelfHostedLegendsArceus } from './selfHosted/legends-arceus';
import { SelfHostedScarletViolet } from './selfHosted/scarlet-violet';
import { SelfHostedSwordShield } from './selfHosted/sword-shield';
import type { ISpriteAPIResponse } from './types';

const baseUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon`;

export async function getPokemonSprite(
	id: number,
	platform: Readonly<App.Platform> | undefined,
	game: IGameGroups | undefined,
	variety: string | null,
	shiny: boolean,
	female: boolean,
	back: boolean,
	animate: boolean
): Promise<ISpriteAPIResponse> {
	let matchesForm = false;

	const ultimateFallback = {
		url: baseUrl + `/${id}.png`,
		alt: 'Front',
		hasShiny: false,
		hasFemale: false,
		matchesVariety: false,
		isBack: false,
		matchesForm,
		isPerfectMatch: false
	};

	const plainPokemon = await getPokemonFromVariety(id, variety, platform).catch((err) => {
		console.log(err);
		return {
			data: undefined
		};
	});
	if (!plainPokemon.data) {
		return ultimateFallback;
	}

	if (variety) {
		const matchingForm = plainPokemon.data.forms.find((apiForm) => apiForm.name === variety);
		if (matchingForm) {
			const formRes = await fetchCacheFirst(matchingForm.url, platform);
			if (formRes.ok) {
				const data = (await formRes.json()) as IPokemon;
				if (!plainPokemon.matchesVariety) {
					plainPokemon.data.sprites = mergeObjects(plainPokemon.data, data.sprites) as ISprites;
				}
				matchesForm = true;
			}
		}

		if (plainPokemon.data.id > 10000) {
			matchesForm = true;
		}
	} else {
		matchesForm = true;
	}

	const gameAnimationSpecificSprites = getSpriteForGameAnimation(plainPokemon.data, game, animate);

	let spriteInfo = getSpriteAndInfo(gameAnimationSpecificSprites, shiny, female, back);

	let selfHostedStrategy: SelfHostedSprite | undefined;
	if (game?.pokeapi === 'scarlet-violet') {
		selfHostedStrategy = new SelfHostedScarletViolet(
			id,
			platform,
			game,
			variety,
			shiny,
			female,
			back,
			animate
		);
	} else if (game?.pokeapi === 'legends-arceus') {
		selfHostedStrategy = new SelfHostedLegendsArceus(
			id,
			platform,
			game,
			variety,
			shiny,
			female,
			back,
			animate
		);
	} else if (game?.pokeapi === 'sword-shield') {
		selfHostedStrategy = new SelfHostedSwordShield(
			id,
			platform,
			game,
			variety,
			shiny,
			female,
			back,
			animate
		);
	}

	if (selfHostedStrategy) {
		const selfHostedData = await selfHostedStrategy.GetSprite();
		if (selfHostedData) {
			spriteInfo.url = selfHostedData.url;
			spriteInfo.isBack = false;
		}
	}

	if (!spriteInfo?.url && game) {
		const retry = getSpriteForGameAnimation(plainPokemon.data, undefined, false);
		spriteInfo = getSpriteAndInfo(retry, shiny, female, back);
	}

	if (!spriteInfo) {
		return {
			...ultimateFallback,
			url: undefined
		};
	}

	const isPerfectMatch =
		(!shiny || (shiny && spriteInfo.hasShiny)) &&
		(!female || (female && spriteInfo.hasFemale)) &&
		(!back || (back && spriteInfo.isBack)) &&
		matchesForm &&
		plainPokemon.matchesVariety;

	return {
		url: spriteInfo.url,
		alt: `${spriteInfo.isBack ? 'Back' : 'Front'}${shiny && spriteInfo.hasShiny ? ' Shiny' : ''}${
			female && spriteInfo.hasFemale ? ' Female' : ''
		}${
			variety && (plainPokemon.matchesVariety || matchesForm)
				? ` ${capitaliseEachWord(variety.replaceAll('-', ' '))}`
				: ''
		}`,
		hasShiny: spriteInfo.hasShiny,
		hasFemale: spriteInfo.hasFemale,
		matchesVariety: plainPokemon.matchesVariety,
		isBack: spriteInfo.isBack,
		matchesForm,
		isPerfectMatch
	};
}

async function getPokemonFromVariety(
	id: number,
	variety: string | null,
	platform: Readonly<Platform> | undefined
): Promise<{
	data: IPokemon | undefined;
	matchesVariety: boolean;
}> {
	async function returnPlainPokmeon(didMatchVariety: boolean) {
		const res = await fetchCacheFirst(`https://pokeapi.co/api/v2/pokemon/${id}`, platform);
		if (!res.ok) {
			return {
				data: undefined,
				matchesVariety: false
			};
		}
		const data = (await res.json()) as IPokemon;
		return {
			data: data,
			matchesVariety: didMatchVariety
		};
	}

	try {
		if (!variety) {
			return await returnPlainPokmeon(true);
		}
		// The species contains the variety information
		const speciesRes = await fetchCacheFirst(
			`https://pokeapi.co/api/v2/pokemon-species/${id}`,
			platform
		);
		if (!speciesRes.ok) {
			return await returnPlainPokmeon(false);
		}
		const species = (await speciesRes.json()) as IPokemonSpecies;

		const speciesVariety = species.varieties.find(
			(apiVariety) => apiVariety.pokemon.name === variety
		);
		if (!speciesVariety) {
			return await returnPlainPokmeon(false);
		}

		const pokemonRes = await fetchCacheFirst(speciesVariety.pokemon.url, platform);
		if (!pokemonRes.ok) {
			return await returnPlainPokmeon(false);
		}

		const data = (await pokemonRes.json()) as IPokemon;
		return {
			data: data,
			matchesVariety: true
		};
	} catch (err) {
		return {
			data: undefined,
			matchesVariety: false
		};
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
