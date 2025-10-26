import PokemonNames from '$lib/data/pokemonNames.json';
import MoveNames from '$lib/data/moves.json';
import type { UserPreferencePokemonVersion } from '$lib/stores/domain';
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
		nationalDexEnd:
			PokemonNames.findLast((a) => a.id < 10000)?.id ??
			PokemonNames[PokemonNames.length - 1]?.id ??
			-1,
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
export enum PokeapiVersionGroups {
	HOME = PokeapiVersionNames.HOME,
	RED_BLUE = PokeapiVersionNames.RED + '-' + PokeapiVersionNames.BLUE,
	YELLOW = PokeapiVersionNames.YELLOW,
	GOLD_SILVER = PokeapiVersionNames.GOLD + '-' + PokeapiVersionNames.SILVER,
	CRYSTAL = PokeapiVersionNames.CRYSTAL,
	RUBY_SAPPHIRE = PokeapiVersionNames.RUBY + '-' + PokeapiVersionNames.SAPPHIRE,
	EMERALD = PokeapiVersionNames.EMERALD,
	FIRERED_LEAFGREEN = PokeapiVersionNames.FIRERED + '-' + PokeapiVersionNames.LEAFGREEN,
	DIAMOND_PEARL = PokeapiVersionNames.DIAMOND + '-' + PokeapiVersionNames.PEARL,
	PLATINUM = PokeapiVersionNames.PLATINUM,
	HEART_GOLD_SOUL_SILVER = PokeapiVersionNames.HEART_GOLD + '-' + PokeapiVersionNames.SOUL_SILVER,
	BLACK_WHITE = PokeapiVersionNames.BLACK + '-' + PokeapiVersionNames.WHITE,
	BLACK_2_WHITE_2 = PokeapiVersionNames.BLACK_2 + '-' + PokeapiVersionNames.WHITE_2,
	X_Y = PokeapiVersionNames.X + '-' + PokeapiVersionNames.Y,
	OMEGA_RUBY_ALPHA_SAPPHIRE = PokeapiVersionNames.OMEGA_RUBY +
		'-' +
		PokeapiVersionNames.ALPHA_SAPPHIRE,
	SUN_MOON = PokeapiVersionNames.SUN + '-' + PokeapiVersionNames.MOON,
	ULTRA_SUN_ULTRA_MOON = PokeapiVersionNames.ULTRA_SUN + '-' + PokeapiVersionNames.ULTRA_MOON,
	PIKACHU_EEVEE = PokeapiVersionNames.PIKACHU + '-' + PokeapiVersionNames.EEVEE,
	SWORD_SHIELD = PokeapiVersionNames.SWORD + '-' + PokeapiVersionNames.SHIELD,
	BRILLIANT_DIAMOND_SHINING_PEARL = PokeapiVersionNames.BRILLIANT_DIAMOND +
		'-and-' +
		PokeapiVersionNames.SHINING_PEARL,
	LEGENDS_ARCEUS = PokeapiVersionNames.LEGENDS_ARCEUS,
	SCARLET_VIOLET = PokeapiVersionNames.SCARLET + '-' + PokeapiVersionNames.VIOLET,
	LEGENDS_ZA = PokeapiVersionNames.LEGENDS_ZA
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
		pokeapi: PokeapiVersionGroups.HOME,
		shortName: 'Home',
		generation: Generations[Generations.length - 1],
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
		pokeapi: PokeapiVersionGroups.RED_BLUE,
		shortName: 'Red / Blue',
		generation: Generations[0],
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
		pokeapi: PokeapiVersionGroups.YELLOW,
		shortName: 'Yellow',
		generation: Generations[0],
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
		pokeapi: PokeapiVersionGroups.GOLD_SILVER,
		shortName: 'Gold / Silver',
		generation: Generations[1],
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
		pokeapi: PokeapiVersionGroups.CRYSTAL,
		shortName: 'Crystal',
		generation: Generations[1],
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
		pokeapi: PokeapiVersionGroups.RUBY_SAPPHIRE,
		shortName: 'Ruby / Sapphire',
		generation: Generations[2],
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
		pokeapi: PokeapiVersionGroups.EMERALD,
		shortName: 'Emerald',
		generation: Generations[2],
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
		pokeapi: PokeapiVersionGroups.FIRERED_LEAFGREEN,
		shortName: 'Fire Red / Leaf Green',
		generation: Generations[2],
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
		pokeapi: PokeapiVersionGroups.DIAMOND_PEARL,
		shortName: 'Diamond / Pearl',
		generation: Generations[3],
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
		pokeapi: PokeapiVersionGroups.PLATINUM,
		shortName: 'Platinum',
		generation: Generations[3],
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
		pokeapi: PokeapiVersionGroups.HEART_GOLD_SOUL_SILVER,
		shortName: 'Heart Gold / Soul Silver',
		generation: Generations[3],
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
		pokeapi: PokeapiVersionGroups.BLACK_WHITE,
		shortName: 'Black / White',
		generation: Generations[4],
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
		pokeapi: PokeapiVersionGroups.BLACK_2_WHITE_2,
		shortName: 'Black 2 / White 2',
		generation: Generations[4],
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
		pokeapi: PokeapiVersionGroups.X_Y,
		shortName: 'X / Y',
		generation: Generations[5],
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
		pokeapi: PokeapiVersionGroups.OMEGA_RUBY_ALPHA_SAPPHIRE,
		shortName: 'Omega Ruby / Alpha Sapphire',
		generation: Generations[5],
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
		pokeapi: PokeapiVersionGroups.SUN_MOON,
		shortName: 'Sun / Moon',
		generation: Generations[6],
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
		pokeapi: PokeapiVersionGroups.ULTRA_SUN_ULTRA_MOON,
		shortName: 'Ultra Sun / Ultra Moon',
		generation: Generations[6],
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
		pokeapi: PokeapiVersionGroups.PIKACHU_EEVEE,
		shortName: "Let's Go Pikachu",
		generation: Generations[6],
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
		pokeapi: PokeapiVersionGroups.SWORD_SHIELD,
		shortName: 'Sword / Shield',
		generation: Generations[7],
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
		pokeapi: PokeapiVersionGroups.BRILLIANT_DIAMOND_SHINING_PEARL,
		shortName: 'Brilliant Diamond / Shining Pearl',
		generation: Generations[7],
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
		pokeapi: PokeapiVersionGroups.LEGENDS_ARCEUS,
		shortName: 'Legends Arceus',
		generation: Generations[7],
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
		pokeapi: PokeapiVersionGroups.SCARLET_VIOLET,
		shortName: 'Scarlet / Violet',
		generation: Generations[8],
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
		pokeapi: PokeapiVersionGroups.LEGENDS_ZA,
		shortName: 'Legends ZA',
		generation: Generations[8],
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
	if (!pokeapiname || pokeapiname === 'generic') {
		return;
	}

	return GameGroups.find((gameGroup) => {
		return gameGroup.pokeapi === pokeapiname;
	});
}

export function getGameGroupFromGame(game: IGame | undefined) {
	if (!game) {
		return;
	}
	return GameGroups.find((groupGame) => groupGame.games.includes(game));
}

// TODO This function should really look at the Pokedex for each game. But pokedex' don't exist yet
export const isPokemonInGameGroup = (nationalDexId: number, gameGroup: IGameGroups | undefined) => {
	if (!gameGroup) return true;

	return nationalDexId < gameGroup.generation.nationalDexEnd;
};

export const getGameFromName = (
	pokeapiname: PokeapiVersionNames | undefined
): { shortName: string; pokeapi: PokeapiVersionNames; globalSortOrder: number } => {
	const matching = GameGroups.find((game) => {
		return game.games.some((game) => game.pokeapi === pokeapiname);
	});

	const home = { shortName: 'Home', pokeapi: PokeapiVersionNames.HOME, globalSortOrder: 1 };

	if (!matching) {
		return home;
	}

	return matching.games.find((game) => game.pokeapi === pokeapiname) ?? home;
};

/**
 * Will return the number of the Generation that a given Pokemon is in
 * @param id The National Pokedex ID for a pokemon
 * @returns Generation number, starting from 1
 */
export const getPokemonGeneration = (id: number) => {
	if (id <= 151) {
		return 1;
	} else if (id > 151 && id <= 252) {
		return 2;
	} else if (id > 252 && id <= 386) {
		return 3;
	} else if (id > 386 && id <= 493) {
		return 4;
	} else if (id > 492 && id <= 649) {
		return 5;
	} else if (id > 649 && id <= 721) {
		return 6;
	} else if (id > 721 && id <= 809) {
		return 7;
	} else if (id > 809 && id <= 905) {
		return 8;
	} else if (id > 905 && id <= 1025) {
		return 9;
	} else {
		return 10;
	}
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
/**
 * Return a scraped entry of a Pokemon with a given ID
 * @param id The national dex id for a pokemon
 * @returns
 */
export const getPokemonEntry = (id: number): IStaticPokemon => {
	const entry = PokemonNames.find((a) => {
		return a.id === id;
	});

	if (!entry) {
		return {
			names: [
				{
					'ja-Hrkt': ''
				}
			],
			id: -1,
			generation: -1,
			redirect: undefined
		};
	}

	const speciesId = entry.redirect ? Number(entry.redirect.split('?')[0]) : entry.id;

	if (entry.id > 10000) {
		return {
			...entry,
			id: speciesId
		};
	}
	return {
		...entry,
		redirect: speciesId.toString()
	};
};

export const getMoveEntry = (id: number): IStaticMove => {
	const entry = MoveNames.find((a) => {
		return a.id === id;
	});

	if (!entry) {
		return {
			id: id,
			names: [
				{
					'ja-Hrkt': ''
				}
			]
		};
	}

	return entry;
};
