import type { Name } from "$/lib/types/IPokemon";
import type { FlavorTextEntry, Language, VersionGroup } from "$/lib/types/Pokeapi";

export type PokeapiAbility = {
    effect_changes: {
        effect_entries: {
            effect: string;
            language: Language;
        }[]
        version_group: VersionGroup
    }[];
    effect_entries: {
        effect: string;
        short_effect: string;
        language: Language;
    }[];
    flavor_text_entries: FlavorTextEntry;
    generation: {
        name: string;
        url: string;
    }
    id: number;
    is_main_series: boolean;
    name: string;
    names: Name[];
    pokemon: {
        is_hidden: boolean;
        slot: number;
        pokemon: {
            name: string;
            url: string;
        }
    }[];
}

export type AbilityResponse = Omit<PokeapiAbility, 'effect_changes'>;