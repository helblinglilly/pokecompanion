/**
 * TODO
 *
 * This file needs to be migrated away
 */

import type { UserPreferencePokemonVersion } from '$lib/stores/domain';
import type { PokeapiVersionGroups } from '$/@types/api.pokecompanion';
export interface IGeneration {
	name: string;
	short: string;
	pokeApiName: string;
	nationalDexEnd: number;
	number: number;
}

export const Generations: IGeneration[] = [
	{
		name: 'Generation 1',
		short: 'Gen 1',
		pokeApiName: 'generation-i',
		nationalDexEnd: 151,
		number: 1
	},
	{
		name: 'Generation 2',
		short: 'Gen 2',
		pokeApiName: 'generation-ii',
		nationalDexEnd: 251,
		number: 2
	},
	{
		name: 'Generation 3',
		short: 'Gen 3',
		pokeApiName: 'generation-iii',
		nationalDexEnd: 386,
		number: 3
	},
	{
		name: 'Generation 4',
		short: 'Gen 4',
		pokeApiName: 'generation-iv',
		nationalDexEnd: 493,
		number: 4
	},
	{
		name: 'Generation 5',
		short: 'Gen 5',
		pokeApiName: 'generation-v',
		nationalDexEnd: 649,
		number: 5
	},
	{
		name: 'Generation 6',
		short: 'Gen 6',
		pokeApiName: 'generation-vi',
		nationalDexEnd: 721,
		number: 6
	},
	{
		name: 'Generation 7',
		short: 'Gen 7',
		pokeApiName: 'generation-vii',
		nationalDexEnd: 809,
		number: 7
	},
	{
		name: 'Generation 8',
		short: 'Gen 8',
		pokeApiName: 'generation-viii',
		nationalDexEnd: 905,
		number: 8
	},
	{
		name: 'Generation 9',
		short: 'Gen 9',
		pokeApiName: 'generation-ix',
		nationalDexEnd: 1025,
		number: 9
	}
];

export enum Regions {
	KANTO = 'Kanto',
	JOHTO = 'Johto',
	HOENN = 'Hoenn',
	SINNOH = 'Sinnoh',
	JOHTOKANTO = 'Johto and Kanto',
	UNOVA = 'Unova',
	KALOS = 'Kalos',
	ALOLA = 'Alola',
	GALAR = 'Galar',
	HISUI = 'Hisui',
	PALDEA = 'Paldea',
	LUMIOSE = 'Lumiose City'
}

export enum PokeapiVersionNames {
	HOME = 'home',
	RED = 'red',
	BLUE = 'blue',
	YELLOW = 'yellow',
	GOLD = 'gold',
	SILVER = 'silver',
	CRYSTAL = 'crystal',
	RUBY = 'ruby',
	SAPPHIRE = 'sapphire',
	EMERALD = 'emerald',
	FIRERED = 'firered',
	LEAFGREEN = 'leafgreen',
	DIAMOND = 'diamond',
	PEARL = 'pearl',
	PLATINUM = 'platinum',
	HEART_GOLD = 'heartgold',
	SOUL_SILVER = 'soulsilver',
	BLACK = 'black',
	WHITE = 'white',
	BLACK_2 = 'black-2',
	WHITE_2 = 'white-2',
	X = 'x',
	Y = 'y',
	OMEGA_RUBY = 'omegaruby',
	ALPHA_SAPPHIRE = 'alphasapphire',
	SUN = 'sun',
	MOON = 'moon',
	ULTRA_SUN = 'ultra-sun',
	ULTRA_MOON = 'ultra-moon',
	PIKACHU = 'lets-go-pikachu',
	EEVEE = 'lets-go-eevee',
	SWORD = 'sword',
	SHIELD = 'shield',
	BRILLIANT_DIAMOND = 'brilliant-diamond',
	SHINING_PEARL = 'shining-pearl',
	LEGENDS_ARCEUS = 'legends-arceus',
	SCARLET = 'scarlet',
	VIOLET = 'violet',
	LEGENDS_ZA = 'legends-za',
	// DLC Game names
	ISLE_OF_ARMOR = 'the-isle-of-armor',
	ISLE_OF_TUNDRA = 'the-crown-tundra',
	TEAL_MASK = 'the-teal-mask',
	INDIGO_DISK = 'the-indigo-disk'
}

export interface IGame {
	shortName: string;
	pokeapi: PokeapiVersionNames;
	globalSortOrder: number;
}
export interface IGameGroups {
	pokeapi: PokeapiVersionGroups;
	shortName: string;
	generation: IGeneration;
	games: IGame[];
	region: Regions;
	dlcGames: IGame[];
}

export const GameGroups: IGameGroups[] = [
	{
		pokeapi: 'home',
		shortName: 'Home',
		generation: Generations[Generations.length - 1]!,
		games: [
			{
				pokeapi: PokeapiVersionNames.HOME,
				shortName: 'Home',
				globalSortOrder: -1
			}
		],
		region: Regions.KANTO,
		dlcGames: []
	},
	{
		pokeapi: 'red-blue',
		shortName: 'Red / Blue',
		generation: Generations[0]!,
		games: [
			{
				pokeapi: PokeapiVersionNames.RED,
				shortName: 'Red',
				globalSortOrder: 0
			},
			{
				pokeapi: PokeapiVersionNames.BLUE,
				shortName: 'Blue',
				globalSortOrder: 1
			}
		],
		region: Regions.KANTO,
		dlcGames: []
	},
	{
		pokeapi: 'yellow',
		shortName: 'Yellow',
		generation: Generations[0]!,
		games: [
			{
				pokeapi: PokeapiVersionNames.YELLOW,
				shortName: 'Yellow',
				globalSortOrder: 2
			}
		],
		region: Regions.KANTO,
		dlcGames: []
	},
	{
		pokeapi: 'gold-silver',
		shortName: 'Gold / Silver',
		generation: Generations[1]!,
		games: [
			{
				pokeapi: PokeapiVersionNames.GOLD,
				shortName: 'Gold',
				globalSortOrder: 3
			},
			{
				pokeapi: PokeapiVersionNames.SILVER,
				shortName: 'Silver',
				globalSortOrder: 4
			}
		],
		region: Regions.JOHTO,
		dlcGames: []
	},
	{
		pokeapi: 'crystal',
		shortName: 'Crystal',
		generation: Generations[1]!,
		games: [
			{
				pokeapi: PokeapiVersionNames.CRYSTAL,
				shortName: 'Crystal',
				globalSortOrder: 5
			}
		],
		region: Regions.JOHTO,
		dlcGames: []
	},
	{
		pokeapi: 'ruby-sapphire',
		shortName: 'Ruby / Sapphire',
		generation: Generations[2]!,
		games: [
			{
				pokeapi: PokeapiVersionNames.RUBY,
				shortName: 'Ruby',
				globalSortOrder: 6
			},
			{
				pokeapi: PokeapiVersionNames.SAPPHIRE,
				shortName: 'Sapphire',
				globalSortOrder: 7
			}
		],
		region: Regions.HOENN,
		dlcGames: []
	},
	{
		pokeapi: 'emerald',
		shortName: 'Emerald',
		generation: Generations[2]!,
		games: [
			{
				pokeapi: PokeapiVersionNames.EMERALD,
				shortName: 'Emerald',
				globalSortOrder: 8
			}
		],
		region: Regions.HOENN,
		dlcGames: []
	},
	{
		pokeapi: 'firered-leafgreen',
		shortName: 'Fire Red / Leaf Green',
		generation: Generations[2]!,
		games: [
			{
				pokeapi: PokeapiVersionNames.FIRERED,
				shortName: 'Fire Red',
				globalSortOrder: 9
			},
			{
				pokeapi: PokeapiVersionNames.LEAFGREEN,
				shortName: 'Leaf Green',
				globalSortOrder: 10
			}
		],
		region: Regions.KANTO,
		dlcGames: []
	},
	{
		pokeapi: 'diamond-pearl',
		shortName: 'Diamond / Pearl',
		generation: Generations[3]!,
		games: [
			{
				pokeapi: PokeapiVersionNames.DIAMOND,
				shortName: 'Diamond',
				globalSortOrder: 11
			},
			{
				pokeapi: PokeapiVersionNames.PEARL,
				shortName: 'Pearl',
				globalSortOrder: 12
			}
		],
		region: Regions.SINNOH,
		dlcGames: []
	},
	{
		pokeapi: 'platinum',
		shortName: 'Platinum',
		generation: Generations[3]!,
		games: [
			{
				pokeapi: PokeapiVersionNames.PLATINUM,
				shortName: 'Platinum',
				globalSortOrder: 13
			}
		],
		region: Regions.SINNOH,
		dlcGames: []
	},
	{
		pokeapi: 'heartgold-soulsilver',
		shortName: 'Heart Gold / Soul Silver',
		generation: Generations[3]!,
		games: [
			{
				pokeapi: PokeapiVersionNames.HEART_GOLD,
				shortName: 'Heart Gold',
				globalSortOrder: 14
			},
			{
				pokeapi: PokeapiVersionNames.SOUL_SILVER,
				shortName: 'Soul Silver',
				globalSortOrder: 15
			}
		],
		region: Regions.JOHTOKANTO,
		dlcGames: []
	},
	{
		pokeapi: 'black-white',
		shortName: 'Black / White',
		generation: Generations[4]!,
		games: [
			{
				pokeapi: PokeapiVersionNames.BLACK,
				shortName: 'Black',
				globalSortOrder: 15
			},
			{
				pokeapi: PokeapiVersionNames.WHITE,
				shortName: 'White',
				globalSortOrder: 16
			}
		],
		region: Regions.UNOVA,
		dlcGames: []
	},
	{
		pokeapi: 'black-2-white-2',
		shortName: 'Black 2 / White 2',
		generation: Generations[4]!,
		games: [
			{
				pokeapi: PokeapiVersionNames.BLACK_2,
				shortName: 'Black 2',
				globalSortOrder: 17
			},
			{
				pokeapi: PokeapiVersionNames.WHITE_2,
				shortName: 'White 2',
				globalSortOrder: 18
			}
		],
		region: Regions.UNOVA,
		dlcGames: []
	},
	{
		pokeapi: 'x-y',
		shortName: 'X / Y',
		generation: Generations[5]!,
		games: [
			{
				pokeapi: PokeapiVersionNames.X,
				shortName: 'X',
				globalSortOrder: 19
			},
			{
				pokeapi: PokeapiVersionNames.Y,
				shortName: 'Y',
				globalSortOrder: 20
			}
		],
		region: Regions.KALOS,
		dlcGames: []
	},
	{
		pokeapi: 'omega-ruby-alpha-sapphire',
		shortName: 'Omega Ruby / Alpha Sapphire',
		generation: Generations[5]!,
		games: [
			{
				pokeapi: PokeapiVersionNames.OMEGA_RUBY,
				shortName: 'Omega Ruby',
				globalSortOrder: 21
			},
			{
				pokeapi: PokeapiVersionNames.ALPHA_SAPPHIRE,
				shortName: 'Alpha Sapphire',
				globalSortOrder: 22
			}
		],
		region: Regions.HOENN,
		dlcGames: []
	},
	{
		pokeapi: 'sun-moon',
		shortName: 'Sun / Moon',
		generation: Generations[6]!,
		games: [
			{
				pokeapi: PokeapiVersionNames.SUN,
				shortName: 'Sun',
				globalSortOrder: 23
			},
			{
				pokeapi: PokeapiVersionNames.MOON,
				shortName: 'Moon',
				globalSortOrder: 24
			}
		],
		region: Regions.ALOLA,
		dlcGames: []
	},
	{
		pokeapi: 'ultra-sun-ultra-moon',
		shortName: 'Ultra Sun / Ultra Moon',
		generation: Generations[6]!,
		games: [
			{
				pokeapi: PokeapiVersionNames.ULTRA_SUN,
				shortName: 'Ultra Sun',
				globalSortOrder: 25
			},
			{
				pokeapi: PokeapiVersionNames.ULTRA_MOON,
				shortName: 'Ultra Moon',
				globalSortOrder: 26
			}
		],
		region: Regions.ALOLA,
		dlcGames: []
	},
	{
		pokeapi: 'lets-go-pikachu-lets-go-eevee',
		shortName: "Let's Go Pikachu",
		generation: Generations[6]!,
		games: [
			{
				pokeapi: PokeapiVersionNames.PIKACHU,
				shortName: "Let's Go Pikachu",
				globalSortOrder: 27
			},
			{
				pokeapi: PokeapiVersionNames.EEVEE,
				shortName: "Let's Go Eevee",
				globalSortOrder: 28
			}
		],
		region: Regions.KANTO,
		dlcGames: []
	},
	{
		pokeapi: 'sword-shield',
		shortName: 'Sword / Shield',
		generation: Generations[7]!,
		games: [
			{
				pokeapi: PokeapiVersionNames.SWORD,
				shortName: 'Sword',
				globalSortOrder: 29
			},
			{
				pokeapi: PokeapiVersionNames.SHIELD,
				shortName: 'Shield',
				globalSortOrder: 30
			}
		],
		region: Regions.GALAR,
		dlcGames: [
			{
				pokeapi: PokeapiVersionNames.ISLE_OF_ARMOR,
				shortName: 'The Isle of Armor',
				globalSortOrder: 31
			},
			{
				pokeapi: PokeapiVersionNames.ISLE_OF_TUNDRA,
				shortName: 'The Isle of Tundra',
				globalSortOrder: 32
			}
		]
	},
	{
		pokeapi: 'brilliant-diamond-and-shining-pearl',
		shortName: 'Brilliant Diamond / Shining Pearl',
		generation: Generations[7]!,
		games: [
			{
				pokeapi: PokeapiVersionNames.BRILLIANT_DIAMOND,
				shortName: 'Brilliant Diamond',
				globalSortOrder: 33
			},
			{
				pokeapi: PokeapiVersionNames.SHINING_PEARL,
				shortName: 'Shining Pearl',
				globalSortOrder: 34
			}
		],
		region: Regions.SINNOH,
		dlcGames: []
	},
	{
		pokeapi: 'legends-arceus',
		shortName: 'Legends Arceus',
		generation: Generations[7]!,
		games: [
			{
				pokeapi: PokeapiVersionNames.LEGENDS_ARCEUS,
				shortName: 'Legends Arceus',
				globalSortOrder: 35
			}
		],
		region: Regions.HISUI,
		dlcGames: []
	},
	{
		pokeapi: 'scarlet-violet',
		shortName: 'Scarlet / Violet',
		generation: Generations[8]!,
		games: [
			{
				pokeapi: PokeapiVersionNames.SCARLET,
				shortName: 'Scarlet',
				globalSortOrder: 36
			},
			{
				pokeapi: PokeapiVersionNames.VIOLET,
				shortName: 'Violet',
				globalSortOrder: 37
			}
		],
		region: Regions.PALDEA,
		dlcGames: [
			{
				pokeapi: PokeapiVersionNames.TEAL_MASK,
				shortName: 'Teal Mask',
				globalSortOrder: 39
			},
			{
				pokeapi: PokeapiVersionNames.INDIGO_DISK,
				shortName: 'Indigo Disk',
				globalSortOrder: 40
			}
		]
	},
	{
		pokeapi: 'legends-za',
		shortName: 'Legends ZA',
		generation: Generations[8]!,
		games: [
			{
				pokeapi: PokeapiVersionNames.LEGENDS_ZA,
				shortName: 'Legends ZA',
				globalSortOrder: 41
			}
		],
		region: Regions.LUMIOSE,
		dlcGames: []
	}
];

/**
 * Returns a VersionGroup based off a single games' Pokeapi name
 * @param pokeapiname
 * @returns
 */
export function getGame(pokeapiname: PokeapiVersionNames | undefined): IGame | undefined {
	if (!pokeapiname) {
		return;
	}

	const matchingGame = GameGroups.find((gameGroup) => {
		return gameGroup.games.find((game) => game.pokeapi === pokeapiname);
	});
	if (matchingGame) {
		return matchingGame.games.find((game) => game.pokeapi === pokeapiname);
	}
	const matchingDLC = GameGroups.find((gameGroups) => {
		return gameGroups.dlcGames.find((game) => game.pokeapi === pokeapiname);
	});
	return matchingDLC?.dlcGames.find((game) => game.pokeapi === pokeapiname);
}

export function getGameGroupFromName(pokeapiname: UserPreferencePokemonVersion) {
	if (!pokeapiname) {
		return;
	}

	return GameGroups.find((gameGroup) => {
		return gameGroup.pokeapi === pokeapiname;
	});
}

// TODO This function should really look at the Pokedex for each game. But pokedex' don't exist yet
export const isPokemonInGameGroup = (nationalDexId: number, gameGroup: IGameGroups | undefined) => {
	if (!gameGroup) return true;

	return nationalDexId < gameGroup.generation.nationalDexEnd;
};

export interface IStaticPokemon {
	id: number;
	generation: number;
	names: {
		'ja-Hrkt'?: string | undefined;
		'zh-Hans'?: string | undefined;
		'zh-Hant'?: string | undefined;
		de?: string | undefined;
		en?: string | undefined;
		es?: string | undefined;
		fr?: string | undefined;
		it?: string | undefined;
		ja?: string | undefined;
		ko?: string | undefined;
		roomaji?: string | undefined;
	}[];
	redirect: string | undefined;
}

export interface IStaticMove {
	id: number;
	names: {
		'ja-Hrkt'?: string | undefined;
		'zh-Hans'?: string | undefined;
		'zh-Hant'?: string | undefined;
		de?: string | undefined;
		en?: string | undefined;
		es?: string | undefined;
		fr?: string | undefined;
		it?: string | undefined;
		ja?: string | undefined;
		ko?: string | undefined;
		roomaji?: string | undefined;
	}[];
}
