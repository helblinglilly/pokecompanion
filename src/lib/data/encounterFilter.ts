import { uniques } from '$lib/utils/array';
import { findGameFromAPIGameName, findGameGroupFromString, games, type IGame } from './games';

export interface IEncounterResponse {
	location_area: {
		name: string;
		url: string;
	};
	version_details: {
		max_chance: number;
		version: {
			name: string; // short name 'black' or 'white'
			url: string;
		};
		encounter_details: {
			chance: number;
			max_level: number;
			min_level: number;
			condition_value: any[];
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
	}[];
}

export interface IEncounterGroups {
	versionGroup: string;
	encounters: IEncounter[];
}

const getVersionGroupEncounters = (encounters: IEncounterResponse[], versionGroup: string) => {
	const relevantData: IEncounter[] = [];
	const selectedVersionGroup = findGameFromAPIGameName(versionGroup);

	encounters.forEach((encounter) => {
		encounter.version_details.forEach((version) => {
			const methods = version.encounter_details.map((detail) => ({
				encounter_method: detail.method.name,
				min_level: detail.min_level,
				max_level: detail.max_level,
				chance: detail.chance
			}));

			if (version.version.name === selectedVersionGroup?.pokeapiName)
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
	);

	const selectedVersionGroup = findGameGroupFromString(game?.cookieGroup);
	const pokeApiNames = selectedVersionGroup?.map((group) => {
		return group.pokeapiName;
	});

	const relevantVersionGroups = allVersionGroups.filter((version) => {
		return game ? pokeApiNames?.includes(version) : true;
	});

	return relevantVersionGroups
		.map((versionGroup) => {
			return {
				versionGroup: versionGroup,
				encounters: getVersionGroupEncounters(encounters, versionGroup)
			};
		})
		.sort((a, b) => {
			const aIndex = games.findIndex((c) => c.pokeapiName === a.versionGroup);
			const bIndex = games.findIndex((c) => c.pokeapiName === b.versionGroup);
			return aIndex < bIndex ? 1 : -1;
		});
};
