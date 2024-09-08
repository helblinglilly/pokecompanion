/**
 * This file should only contain common types found on the API response objects
 */

import type { PokeapiVersionGroups } from "../data/games";
import type { Languages } from "../utils/language";

export interface Language {
	name: keyof Languages;
	url: string;
}

export interface VersionGroup {
	name: PokeapiVersionGroups;
	url: string;
}

export type FlavorTextEntry = {
    flavor_text: string;
    language: Language;
    version_group: VersionGroup;
}