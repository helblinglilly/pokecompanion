import { uniques } from '$lib/utils/array';
import { getGame, PokeapiVersionNames } from './games';

export interface IEncounterResponse {
	location_area: {
		name: string;
		url: string;
	};
	version_details: {
		max_chance: number;
		version: {
			name: PokeapiVersionNames
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
	versionGroup: PokeapiVersionNames;
	encounters: IEncounter[];
}

const getVersionGroupEncounters = (encounters: IEncounterResponse[], versionGroup: PokeapiVersionNames) => {
	const relevantData: IEncounter[] = [];
	const selectedVersionGroup = getGame(versionGroup);

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

			// if (version.version.name === selectedVersionGroup?.pokeapi){
				relevantData.push({
					location: encounter.location_area,
					methods
				});
			// }
		});
	});
	return uniques(relevantData);

};

export const formatEncounters = (
	encounters: IEncounterResponse[],
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

	return allVersionGroups
		.map((versionGroup) => {
			return {
				versionGroup: versionGroup,
				encounters: getVersionGroupEncounters(encounters, versionGroup)
			};
		})
};
