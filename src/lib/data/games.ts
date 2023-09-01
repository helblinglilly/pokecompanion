interface IGeneration {
	name: string;
	short: string;
}

const Generations: IGeneration[] = [
	{
		name: 'Generation 1',
		short: 'Gen 1'
	},
	{
		name: 'Generation 2',
		short: 'Gen 2'
	},
	{
		name: 'Generation 3',
		short: 'Gen 3'
	},
	{
		name: 'Generation 4',
		short: 'Gen 4'
	},
	{
		name: 'Generation 5',
		short: 'Gen 5'
	},
	{
		name: 'Generation 6',
		short: 'Gen 6'
	},
	{
		name: 'Generation 7',
		short: 'Gen 7'
	},
	{
		name: 'Generation 8',
		short: 'Gen 8'
	},
	{
		name: 'Generation 9',
		short: 'Gen 9'
	}
];

enum Regions {
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
}
const game = {
	red: {
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
		generation: Generations[0]
	},
	blue: {
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
		generation: Generations[0]
	},
	yellow: {
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
		generation: Generations[0]
	},
	gold: {
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
		generation: Generations[1]
	},
	silver: {
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
		generation: Generations[1]
	},
	crystal: {
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
		generation: Generations[1]
	},
	ruby: {
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
		generation: Generations[2]
	},
	sapphire: {
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
		generation: Generations[2]
	},
	emerald: {
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
		generation: Generations[2]
	},
	diamond: {
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
		generation: Generations[3]
	},
	pearl: {
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
		generation: Generations[3]
	},
	platinum: {
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
		generation: Generations[3]
	},
	heartGold: {
		name: 'Pokémon Heart Gold Version',
		shortName: 'Heart Gold',
		releaseDates: {
			JP: '2009-09-12',
			NA: '2010-03-14',
			AU: '2010-03-25',
			EU: '2010-03-26'
		},
		region: Regions.JOHTOKANTO,
		console: Consoles.NDS,
		generation: Generations[3]
	},
	soulSilver: {
		name: 'Pokémon Soul Silver Version',
		shortName: 'Soul Silver',
		releaseDates: {
			JP: '2009-09-12',
			NA: '2010-03-14',
			AU: '2010-03-25',
			EU: '2010-03-26'
		},
		region: Regions.JOHTOKANTO,
		console: Consoles.NDS,
		generation: Generations[3]
	},
	black: {
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
		generation: Generations[4]
	},
	white: {
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
		generation: Generations[4]
	},
	black2: {
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
		generation: Generations[4]
	},
	white2: {
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
		generation: Generations[4]
	},
	x: {
		name: 'Pokémon X',
		shortName: 'X',
		releaseDates: {
			Global: '2012-10-12'
		},
		region: Regions.KALOS,
		console: Consoles.N3DS,
		generation: Generations[5]
	},
	y: {
		name: 'Pokémon Y',
		shortName: 'Y',
		releaseDates: {
			Global: '2012-10-12'
		},
		region: Regions.KALOS,
		console: Consoles.N3DS,
		generation: Generations[5]
	},
	omegaRuby: {
		name: 'Pokémon Omega Ruby',
		shortName: 'Omega Ruby',
		releaseDates: {
			Global: '2014-11-21',
			EU: '2014-11-28'
		},
		region: Regions.HOENN,
		console: Consoles.N3DS,
		generation: Generations[5]
	},
	alphaSapphire: {
		name: 'Pokémon Alpha Sapphire',
		shortName: 'Alpha Sapphire',
		releaseDates: {
			Global: '2014-11-21',
			EU: '2014-11-28'
		},
		region: Regions.HOENN,
		console: Consoles.N3DS,
		generation: Generations[5]
	},
	sun: {
		name: 'Pokémon Sun',
		shortName: 'Sun',
		releaseDates: {
			Global: '2016-11-18',
			EU: '2016-11-23'
		},
		region: Regions.ALOLA,
		console: Consoles.N3DS,
		generation: Generations[6]
	},
	moon: {
		name: 'Pokémon Moon',
		shortName: 'Moon',
		releaseDates: {
			Global: '2016-11-18',
			EU: '2016-11-23'
		},
		region: Regions.ALOLA,
		console: Consoles.N3DS,
		generation: Generations[6]
	},
	ultraSun: {
		name: 'Pokémon Ultra Sun',
		shortName: 'Ultra Sun',
		releaseDates: {
			Global: '2017-11-17'
		},
		region: Regions.ALOLA,
		console: Consoles.N3DS,
		generation: Generations[6]
	},
	ultraMoon: {
		name: 'Pokémon Ultra Moon',
		shortName: 'Ultra Moon',
		releaseDates: {
			Global: '2017-11-17'
		},
		region: Regions.ALOLA,
		console: Consoles.N3DS,
		generation: Generations[6]
	},
	pikachu: {
		name: "Pokémon Let's Go Pikachu!",
		shortName: "Let's Go Pikachu",
		releaseDates: {
			Global: '2018-11-16'
		},
		region: Regions.KANTO,
		console: Consoles.SW,
		generation: Generations[6]
	},
	eevee: {
		name: "Pokémon Let's Go Eevee!",
		shortName: "Let's Go Eevee",
		releaseDates: {
			Global: '2018-11-16'
		},
		region: Regions.KANTO,
		console: Consoles.SW,
		generation: Generations[6]
	},
	sword: {
		name: 'Pokémon Sword',
		shortName: 'Sword',
		releaseDates: {
			Global: '2019-11-15'
		},
		region: Regions.GALAR,
		console: Consoles.SW,
		generation: Generations[7]
	},
	shield: {
		name: 'Pokémon Shield',
		shortName: 'Shield',
		releaseDates: {
			Global: '2019-11-15'
		},
		region: Regions.GALAR,
		console: Consoles.SW,
		generation: Generations[7]
	},
	brilliantDiamond: {
		name: 'Pokémon Brilliant Diamond',
		shortName: 'Brilliant Diamond',
		releaseDates: {
			Global: '2021-11-19'
		},
		region: Regions.SINNOH,
		console: Consoles.SW,
		generation: Generations[7]
	},
	shiningPearl: {
		name: 'Pokémon Shining Pearl',
		shortName: 'Shining Pearl',
		releaseDates: {
			Global: '2021-11-19'
		},
		region: Regions.SINNOH,
		console: Consoles.SW,
		generation: Generations[7]
	},
	arceus: {
		name: 'Pokémon Legends Arceus',
		shortName: 'Legends Arceus',
		releaseDates: {
			Global: '2022-01-28'
		},
		region: Regions.HISUI,
		console: Consoles.SW,
		generation: Generations[7]
	},
	scarlet: {
		name: 'Pokémon Scarlet',
		shortName: 'Scarlet',
		releaseDates: {
			Global: '2022-11-18'
		},
		region: Regions.PALDEA,
		console: Consoles.SW,
		generation: Generations[8]
	},
	violet: {
		name: 'Pokémon Violet',
		shortName: 'Violet',
		releaseDates: {
			Global: '2022-11-18'
		},
		region: Regions.PALDEA,
		console: Consoles.SW,
		generation: Generations[8]
	}
};

const gameGroups: IGame[][] = [
	[{ ...game.red }, { ...game.blue }, { ...game.yellow }],
	[{ ...game.gold }, { ...game.silver }, { ...game.crystal }],
	[{ ...game.ruby }, { ...game.sapphire }, { ...game.emerald }],
	[{ ...game.diamond }, { ...game.pearl }, { ...game.platinum }],
	[{ ...game.heartGold }, { ...game.soulSilver }],
	[{ ...game.black }, { ...game.white }],
	[{ ...game.black2 }, { ...game.white2 }],
	[{ ...game.x }, { ...game.y }],
	[{ ...game.omegaRuby }, { ...game.alphaSapphire }],
	[{ ...game.sun }, { ...game.moon }],
	[{ ...game.ultraSun }, { ...game.ultraMoon }],
	[{ ...game.pikachu }, { ...game.eevee }],
	[{ ...game.sword }, { ...game.shield }],
	[{ ...game.brilliantDiamond }, { ...game.shiningPearl }],
	[{ ...game.arceus }],
	[{ ...game.scarlet }, { ...game.violet }]
];

/**
 * Will return a single string combining all shortName entries from game groups
 * @param input IGame[]
 * @param joinCharacter The character(s) to be used to stitch all names together
 * @param lowercase Optional flag to turn all game names lowercase before joining
 * @param removeSpaces Optional flag to remove all spaces from game names before joining
 * @param alphanumericOnly Optional flag to remove all special characters from game names before joining
 * @returns single string
 */
const getGroupName = (
	input: IGame[],
	joinCharacter: string,
	lowercase?: boolean,
	removeSpaces?: boolean,
	alphanumericOnly?: boolean
) => {
	let output = input
		.map((game) => {
			let newName = game.shortName;

			if (removeSpaces) {
				newName = game.shortName.replaceAll(' ', '');
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

export { gameGroups, getGroupName };
