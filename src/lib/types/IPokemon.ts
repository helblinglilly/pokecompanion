import type { PokeapiVersionGroups, PokeapiVersionNames } from "$lib/data/games";

export interface IRecordPokemon {
	id: number;
	gender?: 'female' | 'male' | undefined;
	shiny: true | false | undefined;
	variety?: string;
}

export interface IPokemon {
	abilities: Ability[];
	base_experience: number;
	forms: Form[];
	game_indices: Index[];
	height: number;
	held_items: unknown[];
	id: number;
	is_default: boolean;
	location_area_encounters: string;
	moves: Moveset[];
	name: string;
	order: number;
	past_types: {
		generation: Generation;
		types: ITypeEntry[];
	}[];
	past_abilities: {
		generation: Generation;
		abilities: Ability[];
	}[];
	sprites: ISprites;
	stats: Stat[];
	types: ITypeEntry[];
	weight: number;
	cries: {
		legacy: string;
		latest: string;
	}
}

export interface Ability {
	ability: Ability2;
	is_hidden: boolean;
	slot: number;
}

export interface ApiAbility {
	id: number;
	effect_entries: {
		effect: string;
		short_effect: string;
		language: Language;
	}[];
	name: string;
	names: Name[];
	flavor_text_entries: {
		flavor_text: string;
		language: Language;
		version_group: VersionGroup;
	}[];
	pokemon: {
		is_hidden: boolean;
		slot: number;
		pokemon: {
			name: string;
			url: string;
		};
	}[];
}

interface Ability2 {
	name: string;
	url: string;
}

export interface Form {
	name: string;
	url: string;
}

interface Index {
	game_index: number;
	version: Version;
}

interface Version {
	name: string;
	url: string;
}

export interface Moveset {
	move: Move;
	version_group_details: VersionGroupDetail[];
}

interface Move {
	name: string;
	url: string;
}

interface VersionGroupDetail {
	level_learned_at: number;
	move_learn_method: MoveLearnMethod;
	version_group: VersionGroup;
}

interface MoveLearnMethod {
	name: string;
	url: string;
}

export interface VersionGroup {
	name: PokeapiVersionGroups;
	url: string;
}


export interface IBaseSprites {
	back_default: null | string;
	back_female: null | string;
	back_shiny: null | string;
	back_shiny_female: null | string;
	front_default: string;
	front_female: null | string;
	front_shiny: null | string;
	front_shiny_female: null | string;
}

export interface ISprites extends IBaseSprites {
	other: Other;
	versions: Versions;
}

export const emptySprites = (id: number): ISprites => {
	return {
		back_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${id}.png`,
		back_female: null,
		back_shiny: null,
		back_shiny_female: null,
		front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
		front_female: null,
		front_shiny: null,
		front_shiny_female: null,
		other: {
			dream_world: {
				front_default: null,
				front_female: null
			},
			home: {
				front_default: null,
				front_female: null,
				front_shiny: null,
				front_shiny_female: null
			},
			'official-artwork': {
				front_default: null,
				front_shiny: null
			}
		},
		versions: {}
	};
};

interface Other {
	dream_world: DreamWorld;
	home: Home;
	'official-artwork': OfficialArtwork;
	showdown?: {
		back_default: string | null,
		back_female	: string | null,
		back_shiny	: string | null,
		back_shiny_female	: string | null,
		front_default: string | null,
		front_female: string | null,
		front_shiny	: string | null,
		front_shiny_female: string | null,
	} | undefined
}

interface DreamWorld {
	front_default: null | string;
	front_female: null | unknown;
}

interface Home {
	front_default: null | string;
	front_female: null | unknown;
	front_shiny: null | string;
	front_shiny_female: null | unknown;
}

interface OfficialArtwork {
	front_default: null | string;
	front_shiny: null | string;
}

interface Versions {
	'generation-i'?: GenerationI;
	'generation-ii'?: GenerationIi;
	'generation-iii'?: GenerationIii;
	'generation-iv'?: GenerationIv;
	'generation-v'?: GenerationV;
	'generation-vi'?: GenerationVi;
	'generation-vii'?: GenerationVii;
	'generation-viii'?: GenerationViii;
}

interface GenerationI {
	'red-blue': RedBlue;
	yellow: Yellow;
}

interface RedBlue {
	back_default: string;
	back_gray: string;
	back_transparent: string;
	front_default: string;
	front_gray: string;
	front_transparent: string;
}

interface Yellow {
	back_default: string;
	back_gray: string;
	back_transparent: string;
	front_default: string;
	front_gray: string;
	front_transparent: string;
}

interface GenerationIi {
	crystal: Crystal;
	gold: Gold;
	silver: Silver;
}

interface Crystal {
	back_default: string;
	back_shiny: string;
	back_shiny_transparent: string;
	back_transparent: string;
	front_default: string;
	front_shiny: string;
	front_shiny_transparent: string;
	front_transparent: string;
}

interface Gold {
	back_default: string;
	back_shiny: string;
	front_default: string;
	front_shiny: string;
	front_transparent: string;
}

interface Silver {
	back_default: string;
	back_shiny: string;
	front_default: string;
	front_shiny: string;
	front_transparent: string;
}

interface GenerationIii {
	emerald: Emerald;
	'firered-leafgreen': FireredLeafgreen;
	'ruby-sapphire': RubySapphire;
}

interface Emerald {
	front_default: string;
	front_shiny: string;
}

interface FireredLeafgreen {
	back_default: string;
	back_shiny: string;
	front_default: string;
	front_shiny: string;
}

interface RubySapphire {
	back_default: string;
	back_shiny: string;
	front_default: string;
	front_shiny: string;
}

interface GenerationIv {
	'diamond-pearl': DiamondPearl;
	'heartgold-soulsilver': HeartgoldSoulsilver;
	platinum: Platinum;
}

interface DiamondPearl {
	back_default: string;
	back_female: unknown;
	back_shiny: string;
	back_shiny_female: unknown;
	front_default: string;
	front_female: unknown;
	front_shiny: string;
	front_shiny_female: unknown;
}

interface HeartgoldSoulsilver {
	back_default: string;
	back_female: unknown;
	back_shiny: string;
	back_shiny_female: unknown;
	front_default: string;
	front_female: unknown;
	front_shiny: string;
	front_shiny_female: unknown;
}

interface Platinum {
	back_default: string;
	back_female: unknown;
	back_shiny: string;
	back_shiny_female: unknown;
	front_default: string;
	front_female: unknown;
	front_shiny: string;
	front_shiny_female: unknown;
}

interface GenerationV {
	'black-white': BlackWhite;
}

interface BlackWhite {
	animated: Animated;
	back_default: string;
	back_female: unknown;
	back_shiny: string;
	back_shiny_female: unknown;
	front_default: string;
	front_female: unknown;
	front_shiny: string;
	front_shiny_female: unknown;
}

interface Animated {
	back_default: string;
	back_female: unknown;
	back_shiny: string;
	back_shiny_female: unknown;
	front_default: string;
	front_female: unknown;
	front_shiny: string;
	front_shiny_female: unknown;
}

interface GenerationVi {
	'omegaruby-alphasapphire': OmegarubyAlphasapphire;
	'x-y': XY;
}

interface OmegarubyAlphasapphire {
	front_default: string;
	front_female: unknown;
	front_shiny: string;
	front_shiny_female: unknown;
}

interface XY {
	front_default: string;
	front_female: unknown;
	front_shiny: string;
	front_shiny_female: unknown;
}

interface GenerationVii {
	icons: Icons;
	'ultra-sun-ultra-moon': UltraSunUltraMoon;
}

interface Icons {
	front_default: string;
	front_female: unknown;
}

interface UltraSunUltraMoon {
	front_default: string;
	front_female: unknown;
	front_shiny: string;
	front_shiny_female: unknown;
}

interface GenerationViii {
	icons: Icons2;
}

interface Icons2 {
	front_default: string;
	front_female: unknown;
}

export interface Stat {
	base_stat: number;
	effort: number;
	stat: Stat2;
}

interface Stat2 {
	name: string;
	url: string;
}

export interface ITypeEntry {
	slot: number;
	type: Type2;
}

interface Type2 {
	name: string;
	url: string;
}

export interface IPokemonSpecies {
	base_happiness: number;
	capture_rate: number;
	color: Color;
	egg_groups: EggGroup[];
	evolution_chain: EvolutionChain;
	evolves_from_species: unknown;
	flavor_text_entries: FlavorTextEntry[];
	form_descriptions: unknown[];
	forms_switchable: boolean;
	gender_rate: number;
	genera: Genera[];
	generation: Generation;
	growth_rate: GrowthRate;
	habitat: Habitat;
	has_gender_differences: boolean;
	hatch_counter: number;
	id: number;
	is_baby: boolean;
	is_legendary: boolean;
	is_mythical: boolean;
	name: string;
	names: Name[];
	order: number;
	pal_park_encounters: PalParkEncounter[];
	pokedex_numbers: PokedexNumber[];
	shape: Shape;
	varieties: Variety[];
}

interface Color {
	name: string;
	url: string;
}

interface EggGroup {
	name: string;
	url: string;
}

interface EvolutionChain {
	url: string;
}

export interface FlavorTextEntry {
	flavor_text: string;
	language: Language;
	version: {
		name: PokeapiVersionNames,
		url: string;
	}
}

interface Language {
	name: string;
	url: string;
}

interface Genera {
	genus: string;
	language: Language2;
}

interface Language2 {
	name: string;
	url: string;
}

export interface Generation {
	name: string;
	url: string;
}

interface GrowthRate {
	name: string;
	url: string;
}

interface Habitat {
	name: string;
	url: string;
}

export interface Name {
	language: Language3;
	name: string;
}

interface Language3 {
	name: string;
	url: string;
}

interface PalParkEncounter {
	area: Area;
	base_score: number;
	rate: number;
}

interface Area {
	name: string;
	url: string;
}

interface PokedexNumber {
	entry_number: number;
	pokedex: Pokedex;
}

interface Pokedex {
	name: string;
	url: string;
}

interface Shape {
	name: string;
	url: string;
}

interface Variety {
	is_default: boolean;
	pokemon: Pokemon2;
}

interface Pokemon2 {
	name: string;
	url: string;
}
