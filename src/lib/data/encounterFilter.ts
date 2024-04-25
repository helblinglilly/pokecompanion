import { uniques } from '$lib/utils/array';
import { getGame, getGameGroupFromName, PokeapiVersionNames, type IGame, type PokeapiVersionGroups } from './games';

export interface IEncounterResponse {
	location_area: {
		name: string;
		url: string;
	};
	version_details: {
		max_chance: number;
		version: {
			name: PokeapiVersionNames;
			url: string;
		};
		encounter_details: {
			chance: number;
			max_level: number;
			min_level: number;
			condition_values?: {
				name: string;
				url: string;
			}[];
			method: {
				name: string;
				url: string;
			};
		}[];
	}[];
}

export interface IEncounter {
	location: {
		name: string;
		url: string;
	};
	methods: {
		encounter_method: string;
		min_level: number;
		max_level: number;
		chance: number;
		conditions: string;
	}[];
}

export interface IEncounterGroups {
	versionGroup: PokeapiVersionGroups;
	encounters: IEncounter[];
}

const getVersionGroupEncounters = (encounters: IEncounterResponse[], versionGroup: PokeapiVersionGroups) => {
	const relevantData: IEncounter[] = [];
	const selectedVersionGroup = getGameGroupFromName(versionGroup);

	encounters.forEach((encounter) => {
		encounter.version_details.forEach((version) => {
			const methods = version.encounter_details.map((detail) => {
				return {
					encounter_method: detail.method.name,
					min_level: detail.min_level,
					max_level: detail.max_level,
					chance: detail.chance,
					conditions: detail.condition_values
						? detail.condition_values
								.map((a) => {
									return a.name;
								})
								.join(' or ')
						: ''
				};
			});

			if (selectedVersionGroup?.games.some((selectedGame) => selectedGame.pokeapi === version.version.name))
				relevantData.push({
					location: encounter.location_area,
					methods
				});
		});
	});

	return uniques(relevantData);
};

export const formatEncounters = (
	encounters: IEncounterResponse[],
	game?: IGame | undefined
): IEncounterGroups[] => {
	const allVersionGroups = uniques(
		encounters
			.map((encounter) => {
				return encounter.version_details.map((version) => {
					return version.version.name;
				});
			})
			.flat()
	) as PokeapiVersionNames[];

	const selectedVersionGroup = getGame(game?.pokeapi);
	const pokeApiNames = selectedVersionGroup?.games.map((game) => game.pokeapi);

	// const relevantVersionGroups = allVersionGroups.filter((version) => {
	// 	return game ? pokeApiNames?.includes(version) : true;
	// });

	return [];
	// relevantVersionGroups
	// 	.map((versionGroup) => {
	// 		return {
	// 			versionGroup: versionGroup,
	// 			encounters: getVersionGroupEncounters(encounters, versionGroup)
	// 		};
	// 	})
	// 	.sort((a, b) => {
	// 		const aIndex = 1;
	// 		const bIndex = 2;
	// 		return aIndex < bIndex ? 1 : -1;
	// 	});
};
