import PokemonNames from '$lib/data/pokemonNames.json';
import MoveNames from '$lib/data/moves.json';
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
		nationalDexEnd: PokemonNames.findLast((a) => a.id < 10000)?.id ?? PokemonNames[PokemonNames.length - 1].id,
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
	PALDEA = 'Paldea'
}

enum Consoles {
	GB = 'Gameboy',
	GBC = 'Gameboy Color',
	GBA = 'Gameboy Advanced',
	NDS = 'Nintendo DS',
	N3DS = 'Nintendo 3DS',
	SW = 'Nintendo Switch'
}

export interface IGame {
	name: string;
	shortName: string;
	releaseDates: object;
	region: Regions;
	console: Consoles;
	generation: IGeneration;
	cookieGroup: string;
	pokeapiName: string;
	pokeapiVersionGroup: string;
	dlcGames?: IDlcGames[];
}

interface IDlcGames {
	name: string;
	shortName: string;
	pokeapiName: string;
}

const dlcGames = [
	{
		name: 'Isle of Armor',
		shortName: 'Isle of Armor',
		pokeapiName: 'the-isle-of-armor'
	},
	{
		name: 'The Crown Tundra',
		shortName: 'Crown Tundra',
		pokeapiName: 'the-crown-tundra'
	},
	{
		name: 'The Teal Mask',
		shortName: 'Teal Mask',
		pokeapiName: 'the-teal-mask'
	},
	{
		name: 'The Indigo Disk',
		shortName: 'Indigo Disk',
		pokeapiName: 'the-indigo-disk'
	}
];

export const games = [
	{
		name: 'Pokémon Red Version',
		shortName: 'Red',
		releaseDates: {
			JA: '1996-02-27',
			NA: '1998-09-28',
			AU: '1998-10-23',
			EU: '1999-10-05'
		},
		region: Regions.KANTO,
		console: Consoles.GB,
		generation: Generations[0],
		icon: 'icons/games/red.png',
		cookieGroup: 'red-blue',
		pokeapiName: 'red',
		pokeapiVersionGroup: 'red-blue',
	},
	{
		name: 'Pokémon Blue Version',
		shortName: 'Blue',
		releaseDates: {
			JA: '1996-02-27',
			NA: '1998-09-28',
			AU: '1998-10-23',
			EU: '1999-10-05'
		},
		region: Regions.KANTO,
		console: Consoles.GB,
		generation: Generations[0],
		icon: 'icons/games/blue.png',
		cookieGroup: 'red-blue',
		pokeapiName: 'blue',
		pokeapiVersionGroup: 'red-blue'
	},
	{
		name: 'Pokémon Yellow Version',
		shortName: 'Yellow',
		releaseDates: {
			JP: '1998-09-12',
			AU: '1999-09-03',
			NA: '1999-10-19',
			EU: '2000-06-16'
		},
		region: Regions.KANTO,
		console: Consoles.GB,
		generation: Generations[0],
		icon: 'icons/games/yellow.png',
		cookieGroup: 'yellow',
		pokeapiName: 'yellow',
		pokeapiVersionGroup: 'yellow'
	},
	{
		name: 'Pokémon Gold Version',
		shortName: 'Gold',
		releaseDates: {
			JP: '1999-11-21',
			NA: '2000-07-29',
			AU: '2000-10-15',
			EU: '2001-04-06'
		},
		region: Regions.JOHTO,
		console: Consoles.GBC,
		generation: Generations[1],
		icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/gold/250.png',
		cookieGroup: 'gold-silver',
		pokeapiName: 'gold',
		pokeapiVersionGroup: 'gold-silver'
	},
	{
		name: 'Pokémon Silver Version',
		shortName: 'Silver',
		releaseDates: {
			JP: '1999-11-21',
			NA: '2000-07-29',
			AU: '2000-10-15',
			EU: '2001-04-06'
		},
		region: Regions.JOHTO,
		console: Consoles.GBC,
		generation: Generations[1],
		icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/gold/249.png',
		cookieGroup: 'gold-silver',
		pokeapiName: 'silver',
		pokeapiVersionGroup: 'gold-silver'
	},
	{
		name: 'Pokémon Crystal Version',
		shortName: 'Crystal',
		releaseDates: {
			JP: '2000-12-14',
			NA: '2001-07-29',
			AU: '2001-09-30',
			EU: '2001-11-02'
		},
		region: Regions.JOHTO,
		console: Consoles.GBC,
		generation: Generations[1],
		icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/gold/245.png',
		cookieGroup: 'crystal',
		pokeapiName: 'crystal',
		pokeapiVersionGroup: 'crystal'
	},
	{
		name: 'Pokémon Ruby Version',
		shortName: 'Ruby',
		releaseDates: {
			JP: '2002-11-21',
			NA: '2003-03-19',
			AU: '2003-04-02',
			EU: '2003-07-25'
		},
		region: Regions.HOENN,
		console: Consoles.GBA,
		generation: Generations[2],
		icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/ruby-sapphire/383.png',
		cookieGroup: 'ruby-sapphire',
		pokeapiName: 'ruby',
		pokeapiVersionGroup: 'ruby-sapphire'
	},
	{
		name: 'Pokémon Sapphire Version',
		shortName: 'Sapphire',
		releaseDates: {
			JP: '2002-11-21',
			NA: '2003-03-19',
			AU: '2003-04-02',
			EU: '2003-07-25'
		},
		region: Regions.HOENN,
		console: Consoles.GBA,
		generation: Generations[2],
		icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/ruby-sapphire/382.png',
		cookieGroup: 'ruby-sapphire',
		pokeapiName: 'sapphire',
		pokeapiVersionGroup: 'ruby-sapphire'
	},
	{
		name: 'Pokémon Emerald Version',
		shortName: 'Emerald',
		releaseDates: {
			JP: '2004-19-16',
			NA: '2005-05-01',
			AU: '2005-06-09',
			EU: '2005-10-21'
		},
		region: Regions.HOENN,
		console: Consoles.GBA,
		generation: Generations[2],
		icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/emerald/384.png',
		cookieGroup: 'emerald',
		pokeapiName: 'emerald',
		pokeapiVersionGroup: 'emerald'
	},
	{
		name: 'Pokémon Fire Red Version',
		shortName: 'Firered',
		releaseDates: {
			JP: '2002-11-21',
			NA: '2003-03-19',
			AU: '2003-04-02',
			EU: '2003-07-25'
		},
		region: Regions.KANTO,
		console: Consoles.GBA,
		generation: Generations[2],
		icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/firered-leafgreen/6.png',
		cookieGroup: 'firered-leafgreen',
		pokeapiName: 'firered',
		pokeapiVersionGroup: 'firered-leafgreen'
	},
	{
		name: 'Pokémon Leaf Green Version',
		shortName: 'Leafgreen',
		releaseDates: {
			JP: '2004-19-16',
			NA: '2005-05-01',
			AU: '2005-06-09',
			EU: '2005-10-21'
		},
		region: Regions.KANTO,
		console: Consoles.GBA,
		generation: Generations[2],
		icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/firered-leafgreen/3.png',
		cookieGroup: 'firered-leafgreen',
		pokeapiName: 'leafgreen',
		pokeapiVersionGroup: 'firered-leafgreen'
	},
	{
		name: 'Pokémon Diamond Version',
		shortName: 'Diamond',
		releaseDates: {
			JP: '2006-09-28',
			NA: '2007-04-22',
			AU: '2007-06-21',
			EU: '2007-07-27',
			KO: '2008-02-14'
		},
		region: Regions.SINNOH,
		console: Consoles.NDS,
		generation: Generations[3],
		icon: 'icons/games/diamond.png',
		cookieGroup: 'diamond-pearl',
		pokeapiName: 'diamond',
		pokeapiVersionGroup: 'diamond-pearl'
	},
	{
		name: 'Pokémon Pearl Version',
		shortName: 'Pearl',
		releaseDates: {
			JP: '2006-09-28',
			NA: '2007-04-22',
			AU: '2007-06-21',
			EU: '2007-07-27',
			KO: '2008-02-14'
		},
		region: Regions.SINNOH,
		console: Consoles.NDS,
		generation: Generations[3],
		icon: 'icons/games/pearl.png',
		cookieGroup: 'diamond-pearl',
		pokeapiName: 'pearl',
		pokeapiVersionGroup: 'diamond-pearl'
	},
	{
		name: 'Pokémon Platinum Version',
		shortName: 'Platinum',
		releaseDates: {
			JP: '2008-09-13',
			NA: '2009-03-22',
			AU: '2009-05-14',
			EU: '2009-05-22'
		},
		region: Regions.SINNOH,
		console: Consoles.NDS,
		generation: Generations[3],
		icon: 'icons/games/platinum.png',
		cookieGroup: 'platinum',
		pokeapiName: 'platinum',
		pokeapiVersionGroup: 'platinum'
	},
	{
		name: 'Pokémon Heart Gold Version',
		shortName: 'HeartGold',
		releaseDates: {
			JP: '2009-09-12',
			NA: '2010-03-14',
			AU: '2010-03-25',
			EU: '2010-03-26'
		},
		region: Regions.JOHTOKANTO,
		console: Consoles.NDS,
		generation: Generations[3],
		cookieGroup: 'heartgold-soulsilver',
		icon: 'icons/games/heartgold.gif',
		pokeapiName: 'heartgold',
		pokeapiVersionGroup: 'heartgold-soulsilver'
	},
	{
		name: 'Pokémon Soul Silver Version',
		shortName: 'SoulSilver',
		releaseDates: {
			JP: '2009-09-12',
			NA: '2010-03-14',
			AU: '2010-03-25',
			EU: '2010-03-26'
		},
		region: Regions.JOHTOKANTO,
		console: Consoles.NDS,
		generation: Generations[3],
		cookieGroup: 'heartgold-soulsilver',
		icon: 'icons/games/soulsilver.png',
		pokeapiName: 'soulsilver',
		pokeapiVersionGroup: 'heartgold-soulsilver'
	},
	{
		name: 'Pokémon Black Version',
		shortName: 'Black',
		releaseDates: {
			JP: '2010-09-18',
			NA: '2011-03-06',
			AU: '2011-03-10',
			EU: '2011-03-04'
		},
		region: Regions.UNOVA,
		console: Consoles.NDS,
		generation: Generations[4],
		icon: 'icons/games/black.gif',
		cookieGroup: 'black-white',
		pokeapiName: 'black',
		pokeapiVersionGroup: 'black-white'
	},
	{
		name: 'Pokémon White Version',
		shortName: 'White',
		releaseDates: {
			JP: '2010-09-18',
			NA: '2011-03-06',
			AU: '2011-03-10',
			EU: '2011-03-04'
		},
		region: Regions.UNOVA,
		console: Consoles.NDS,
		generation: Generations[4],
		icon: 'icons/games/white.gif',
		cookieGroup: 'black-white',
		pokeapiName: 'white',
		pokeapiVersionGroup: 'black-white'
	},
	{
		name: 'Pokémon Black Version 2',
		shortName: 'Black 2',
		releaseDates: {
			JP: '2012-06-23',
			NA: '2012-10-07',
			AU: '2012-10-11',
			EU: '2012-10-12'
		},
		region: Regions.UNOVA,
		console: Consoles.NDS,
		generation: Generations[4],
		icon: 'icons/games/black2.png',
		cookieGroup: 'black2-white2',
		pokeapiName: 'black-2',
		pokeapiVersionGroup: 'black-2-white-2'
	},
	{
		name: 'Pokémon White Version 2',
		shortName: 'White 2',
		releaseDates: {
			JP: '2012-06-23',
			NA: '2012-10-07',
			AU: '2012-10-11',
			EU: '2012-10-12'
		},
		region: Regions.UNOVA,
		console: Consoles.NDS,
		generation: Generations[4],
		icon: 'icons/games/white2.png',
		cookieGroup: 'black2-white2',
		pokeapiName: 'white-2',
		pokeapiVersionGroup: 'black-2-white-2'
	},
	{
		name: 'Pokémon X',
		shortName: 'X',
		releaseDates: {
			Global: '2012-10-12'
		},
		region: Regions.KALOS,
		console: Consoles.N3DS,
		generation: Generations[5],
		icon: 'icons/games/x.png',
		cookieGroup: 'x-y',
		pokeapiName: 'x',
		pokeapiVersionGroup: 'x-y'
	},
	{
		name: 'Pokémon Y',
		shortName: 'Y',
		releaseDates: {
			Global: '2012-10-12'
		},
		region: Regions.KALOS,
		console: Consoles.N3DS,
		generation: Generations[5],
		icon: 'icons/games/y.png',
		cookieGroup: 'x-y',
		pokeapiName: 'y',
		pokeapiVersionGroup: 'x-y'
	},
	{
		name: 'Pokémon Omega Ruby',
		shortName: 'Omega Ruby',
		releaseDates: {
			Global: '2014-11-21',
			EU: '2014-11-28'
		},
		region: Regions.HOENN,
		console: Consoles.N3DS,
		generation: Generations[5],
		icon: 'icons/games/omega-ruby.png',
		cookieGroup: 'omegaruby-alphasapphire',
		pokeapiName: 'omega-ruby',
		pokeapiVersionGroup: 'omega-ruby-alpha-sapphire'
	},
	{
		name: 'Pokémon Alpha Sapphire',
		shortName: 'Alpha Sapphire',
		releaseDates: {
			Global: '2014-11-21',
			EU: '2014-11-28'
		},
		region: Regions.HOENN,
		console: Consoles.N3DS,
		generation: Generations[5],
		cookieGroup: 'omegaruby-alphasapphire',
		icon: 'icons/games/alpha-sapphire.png',
		pokeapiName: 'alpha-sapphire',
		pokeapiVersionGroup: 'omega-ruby-alpha-sapphire'
	},
	{
		name: 'Pokémon Sun',
		shortName: 'Sun',
		releaseDates: {
			Global: '2016-11-18',
			EU: '2016-11-23'
		},
		region: Regions.ALOLA,
		console: Consoles.N3DS,
		generation: Generations[6],
		icon: 'icons/games/sun.png',
		cookieGroup: 'sun-moon',
		pokeapiName: 'sun',
		pokeapiVersionGroup: 'sun-moon'
	},
	{
		name: 'Pokémon Moon',
		shortName: 'Moon',
		releaseDates: {
			Global: '2016-11-18',
			EU: '2016-11-23'
		},
		region: Regions.ALOLA,
		console: Consoles.N3DS,
		generation: Generations[6],
		icon: 'icons/games/moon.png',
		cookieGroup: 'sun-moon',
		pokeapiName: 'moon',
		pokeapiVersionGroup: 'sun-moon'
	},
	{
		name: 'Pokémon Ultra Sun',
		shortName: 'Ultra Sun',
		releaseDates: {
			Global: '2017-11-17'
		},
		region: Regions.ALOLA,
		console: Consoles.N3DS,
		generation: Generations[6],
		icon: 'icons/games/ultra-sun.png',
		cookieGroup: 'ultrasun-ultramoon',
		pokeapiName: 'ultra-sun',
		pokeapiVersionGroup: 'ultra-sun-ultra-moon'
	},
	{
		name: 'Pokémon Ultra Moon',
		shortName: 'Ultra Moon',
		releaseDates: {
			Global: '2017-11-17'
		},
		region: Regions.ALOLA,
		console: Consoles.N3DS,
		generation: Generations[6],
		icon: 'icons/games/ultra-moon.png',
		cookieGroup: 'ultrasun-ultramoon',
		pokeapiName: 'ultra-moon',
		pokeapiVersionGroup: 'ultra-sun-ultra-moon'
	},
	{
		name: "Pokémon Let's Go Pikachu!",
		shortName: "Let's Go Pikachu",
		releaseDates: {
			Global: '2018-11-16'
		},
		region: Regions.KANTO,
		console: Consoles.SW,
		generation: Generations[6],
		cookieGroup: 'letsgopikachu-letsgoeevee',
		icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
		pokeapiName: 'lets-go-pikachu',
		pokeapiVersionGroup: 'lets-go-pikachu-lets-go-eevee'
	},
	{
		name: "Pokémon Let's Go Eevee!",
		shortName: "Let's Go Eevee",
		releaseDates: {
			Global: '2018-11-16'
		},
		region: Regions.KANTO,
		console: Consoles.SW,
		generation: Generations[6],
		cookieGroup: 'letsgopikachu-letsgoeevee',
		icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png',
		pokeapiName: 'lets-go-eevee',
		pokeapiVersionGroup: 'lets-go-pikachu-lets-go-eevee'
	},
	{
		name: 'Pokémon Sword',
		shortName: 'Sword',
		releaseDates: {
			Global: '2019-11-15'
		},
		region: Regions.GALAR,
		console: Consoles.SW,
		generation: Generations[7],
		cookieGroup: 'sword-shield',
		icon: 'icon/game/sword.png',
		pokeapiName: 'sword',
		dlcGames: [dlcGames[0], dlcGames[1]],
		pokeapiVersionGroup: 'sword-shield'
	},
	{
		name: 'Pokémon Shield',
		shortName: 'Shield',
		releaseDates: {
			Global: '2019-11-15'
		},
		region: Regions.GALAR,
		console: Consoles.SW,
		generation: Generations[7],
		cookieGroup: 'sword-shield',
		icon: 'icon/game/shield.png',
		pokeapiName: 'shield',
		dlcGames: [dlcGames[0], dlcGames[1]],
		pokeapiVersionGroup: 'sword-shield'
	},
	{
		name: 'Pokémon Brilliant Diamond',
		shortName: 'Brilliant Diamond',
		releaseDates: {
			Global: '2021-11-19'
		},
		region: Regions.SINNOH,
		console: Consoles.SW,
		generation: Generations[7],
		icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/483.png',
		cookieGroup: 'brilliantdiamond-shiningpearl',
		pokeapiName: 'brilliant-diamond',
		pokeapiVersionGroup: 'brilliant-diamond-and-shining-pearl'
	},
	{
		name: 'Pokémon Shining Pearl',
		shortName: 'Shining Pearl',
		releaseDates: {
			Global: '2021-11-19'
		},
		region: Regions.SINNOH,
		console: Consoles.SW,
		generation: Generations[7],
		icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/484.png',
		cookieGroup: 'brilliantdiamond-shiningpearl',
		pokeapiName: 'shining-pearl',
		pokeapiVersionGroup: 'brilliant-diamond-and-shining-pearl'
	},
	{
		name: 'Pokémon Legends Arceus',
		shortName: 'Legends Arceus',
		releaseDates: {
			Global: '2022-01-28'
		},
		region: Regions.HISUI,
		console: Consoles.SW,
		generation: Generations[7],
		icon: 'https://gamerwk.sgp1.cdn.digitaloceanspaces.com/2022/02/Pokemon-Legends-Icon.jpeg',
		cookieGroup: 'legendsarceus',
		pokeapiName: 'legends-arceus',
		pokeapiVersionGroup: 'legends-arceus'
	},
	{
		name: 'Pokémon Scarlet',
		shortName: 'Scarlet',
		releaseDates: {
			Global: '2022-11-18'
		},
		region: Regions.PALDEA,
		console: Consoles.SW,
		generation: Generations[8],
		icon: 'icons/games/scarlet.webp',
		cookieGroup: 'scarlet-violet',
		pokeapiName: 'scarlet',
		dlcGames: [dlcGames[2], dlcGames[3]],
		pokeapiVersionGroup: 'scarlet-violet'
	},
	{
		name: 'Pokémon Violet',
		shortName: 'Violet',
		releaseDates: {
			Global: '2022-11-18'
		},
		region: Regions.PALDEA,
		console: Consoles.SW,
		generation: Generations[8],
		icon: 'https://assets-prd.ignimgs.com/2022/08/03/pokemon-violet-1659542326365.jpg',
		cookieGroup: 'scarlet-violet',
		pokeapiName: 'violet',
		dlcGames: [dlcGames[2], dlcGames[3]],
		pokeapiVersionGroup: 'scarlet-violet'
	}
];

export const gameGroups: IGame[][] = [
	[{ ...games[0] }, { ...games[1] }],
	[{ ...games[2] }],
	[{ ...games[3] }, { ...games[4] }],
	[{ ...games[5] }],
	[{ ...games[6] }, { ...games[7] }],
	[{ ...games[8] }],
	[{ ...games[9] }, { ...games[10] }],
	[{ ...games[11] }, { ...games[12] }],
	[{ ...games[13] }],
	[{ ...games[14] }, { ...games[15] }],
	[{ ...games[16] }, { ...games[17] }],
	[{ ...games[18] }, { ...games[19] }],
	[{ ...games[20] }, { ...games[21] }],
	[{ ...games[22] }, { ...games[23] }],
	[{ ...games[24] }, { ...games[25] }],
	[{ ...games[26] }, { ...games[27] }],
	[{ ...games[28] }, { ...games[29] }],
	[{ ...games[30] }, { ...games[31] }],
	[{ ...games[32] }, { ...games[33] }],
	[{ ...games[34] }],
	[{ ...games[35] }, { ...games[36] }]
];

/**
 * Will return a single string combining all shortName entries from game groups
 * @param input IGame[]
 * @param joinCharacter The character(s) to be used to stitch all names together
 * @param lowercase Optional flag to turn all game names lowercase before joining
 * @param removeSpaces Optional flag to remove all spaces from game names before joining
 * @param alphanumericOnly Optional flag to remove all special characters from game names before joining
 * * @param replaceSpacesWith Optional entry, only works with replace spaces - the character that should be used to replace spaces with
 * @returns single string
 */
export const getGroupName = (
	input: IGame[],
	joinCharacter: string,
	lowercase?: boolean,
	removeSpaces?: boolean,
	alphanumericOnly?: boolean,
	replaceSpacesWith?: string
) => {
	let output = input
		.map((game) => {
			let newName = game.shortName;

			if (removeSpaces) {
				newName = game.shortName.replaceAll(' ', replaceSpacesWith ?? '');
			}

			if (alphanumericOnly) {
				newName = newName.replaceAll(/[^a-zA-Z0-9 ]/g, '');
			}

			return newName;
		})
		.join(joinCharacter);

	if (lowercase) {
		output = output.toLowerCase();
	}
	return output;
};

/**
 * Will try to find the corresponding game entry for a game string as stored in cookies NOT the PokeAPIs representation
 * @param gameName Cookie string of a game
 * @returns The game object if it matches, or undefined
 */
export const findGameFromString = (gameName: string | undefined): IGame | undefined => {
	return games.find((game) => {
		return game.cookieGroup === gameName;
	});
};

/**
 * Will try to find the group of games for a game string as stored in cookies NOT in the PokeAPIs representation
 * @param gameName Cookie string of a game
 * @returns Array of Game objects (i.e. [Black, White] for black-white) or undefined if it was not found
 */
export const findGameGroupFromString = (gameName: string | undefined): IGame[] | undefined => {
	return gameGroups.find((gameGroup) => {
		return gameGroup.find((game) => {
			return game.cookieGroup === gameName;
		});
	});
};

export const findGameFromAPIGameName = (versionName: string) => {
	return games.find((game) => {
		return getGroupName([game], '-', true, true, false, '-').replaceAll("'", '') === versionName;
	});
};

/**
 * Will indicate whether or not a pokemon with a given pokedex id is in a game
 * @param nationalDexId The ID of the Pokemon
 * @param game The Game object
 * @returns true if it is in a game or no game has been provided, false if it is not in a specified game
 */
export const isPokemonInGame = (nationalDexId: number, game: IGame | undefined) => {
	if (!game) {
		return true;
	}

	if (nationalDexId > game.generation.nationalDexEnd) {
		return false;
	}
	return true;
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
	} else if (id > 905 && id <= 1017) {
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
