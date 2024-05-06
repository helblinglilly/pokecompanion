import { PokeapiVersionNames } from './games';

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

export type IEncounterLocation = {
		method: string;
		minLevel: number;
		maxLevel: number;
		chance: number;
		conditions: string[];
}

export type IEncounters = {
	[version_name in PokeapiVersionNames]?: {
        [location_area: string]: IEncounterLocation[]
    };
};

export const formatEncounters = (
	encounters: IEncounterResponse[],
): IEncounters => {
	const formattedEncounters: IEncounters = {};

	encounters.forEach((encounter) => {
		encounter.version_details.forEach((versionDetails) => {
			const versionName = versionDetails.version.name as PokeapiVersionNames;			
			if (!formattedEncounters[versionName]) {
				formattedEncounters[versionName] = {};
			}
			if (!formattedEncounters[versionName][encounter.location_area.name]){
				formattedEncounters[versionName][encounter.location_area.name] = [];
			}

			versionDetails.encounter_details.forEach((encounterDetails) => {
				if (formattedEncounters[versionName]){
					formattedEncounters[versionName][encounter.location_area.name].push({
						method: encounterDetails.method.name,
						minLevel: encounterDetails.min_level,
						maxLevel: encounterDetails.max_level,
						chance: encounterDetails.chance,
						conditions: encounterDetails.condition_values?.map((condition) => condition.name) ?? []
					})
				}
			})
		});
	});

	return formattedEncounters;
};
