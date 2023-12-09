export interface IPokemon {
	abilities: Ability[];
	base_experience: number;
	forms: Form[];
	game_indices: Index[];
	height: number;
	held_items: any[];
	id: number;
	is_default: boolean;
	location_area_encounters: string;
	moves: Mfe[];
	name: string;
	order: number;
	past_types: {
		generation: Generation;
		types: Type[];
	}[];
	sprites: ISprites;
	stats: Stat[];
	types: Type[];
	weight: number;
}

interface Ability {
	ability: Ability2;
	is_hidden: boolean;
	slot: number;
}

interface Ability2 {
	name: string;
	url: string;
}

interface Form {
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

interface Mfe {
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

interface VersionGroup {
	name: string;
	url: string;
}

interface Species {
	name: string;
	url: string;
}

export interface ISprites {
	back_default: null | string;
	back_female: null | string;
	back_shiny: null | string;
	back_shiny_female: null | string;
	front_default: string;
	front_female: null | string;
	front_shiny: null | string;
	front_shiny_female: null | string;
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
}

interface DreamWorld {
	front_default: null | string;
	front_female: null | any;
}

interface Home {
	front_default: null | string;
	front_female: null | any;
	front_shiny: null | string;
	front_shiny_female: null | any;
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
	back_female: any;
	back_shiny: string;
	back_shiny_female: any;
	front_default: string;
	front_female: any;
	front_shiny: string;
	front_shiny_female: any;
}

interface HeartgoldSoulsilver {
	back_default: string;
	back_female: any;
	back_shiny: string;
	back_shiny_female: any;
	front_default: string;
	front_female: any;
	front_shiny: string;
	front_shiny_female: any;
}

interface Platinum {
	back_default: string;
	back_female: any;
	back_shiny: string;
	back_shiny_female: any;
	front_default: string;
	front_female: any;
	front_shiny: string;
	front_shiny_female: any;
}

interface GenerationV {
	'black-white': BlackWhite;
}

interface BlackWhite {
	animated: Animated;
	back_default: string;
	back_female: any;
	back_shiny: string;
	back_shiny_female: any;
	front_default: string;
	front_female: any;
	front_shiny: string;
	front_shiny_female: any;
}

interface Animated {
	back_default: string;
	back_female: any;
	back_shiny: string;
	back_shiny_female: any;
	front_default: string;
	front_female: any;
	front_shiny: string;
	front_shiny_female: any;
}

interface GenerationVi {
	'omegaruby-alphasapphire': OmegarubyAlphasapphire;
	'x-y': XY;
}

interface OmegarubyAlphasapphire {
	front_default: string;
	front_female: any;
	front_shiny: string;
	front_shiny_female: any;
}

interface XY {
	front_default: string;
	front_female: any;
	front_shiny: string;
	front_shiny_female: any;
}

interface GenerationVii {
	icons: Icons;
	'ultra-sun-ultra-moon': UltraSunUltraMoon;
}

interface Icons {
	front_default: string;
	front_female: any;
}

interface UltraSunUltraMoon {
	front_default: string;
	front_female: any;
	front_shiny: string;
	front_shiny_female: any;
}

interface GenerationViii {
	icons: Icons2;
}

interface Icons2 {
	front_default: string;
	front_female: any;
}

interface Stat {
	base_stat: number;
	effort: number;
	stat: Stat2;
}

interface Stat2 {
	name: string;
	url: string;
}

interface Type {
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
	evolves_from_species: any;
	flavor_text_entries: FlavorTextEntry[];
	form_descriptions: any[];
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
	version: Version2;
}

interface Language {
	name: string;
	url: string;
}

interface Version2 {
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

interface Generation {
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
