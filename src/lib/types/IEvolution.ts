export interface IAPIEvolution {
	baby_trigger_item: any;
	chain: IEvolutionChain;
	id: number;
}

export interface IEvolutionChain {
	evolution_details: any[];
	evolves_to: EvolvesTo[];
	is_baby: boolean;
	species: Species3;
}

interface EvolvesTo {
	evolution_details: EvolutionDetail[];
	evolves_to: EvolvesTo2[];
	is_baby: boolean;
	species: Species2;
}

export interface EvolutionDetail {
	gender: any;
	held_item: any;
	item: any;
	known_move: any;
	known_move_type: any;
	location: any;
	min_affection: any;
	min_beauty: any;
	min_happiness: any;
	min_level: number;
	needs_overworld_rain: boolean;
	party_species: any;
	party_type: any;
	relative_physical_stats: any;
	time_of_day: string;
	trade_species: any;
	trigger: Trigger;
	turn_upside_down: boolean;
}

interface Trigger {
	name: string;
	url: string;
}

interface EvolvesTo2 {
	evolution_details: EvolutionDetail2[];
	evolves_to: any[];
	is_baby: boolean;
	species: Species;
}

interface EvolutionDetail2 {
	gender: any;
	held_item: any;
	item: any;
	known_move: any;
	known_move_type: any;
	location: any;
	min_affection: any;
	min_beauty: any;
	min_happiness: any;
	min_level: number;
	needs_overworld_rain: boolean;
	party_species: any;
	party_type: any;
	relative_physical_stats: any;
	time_of_day: string;
	trade_species: any;
	trigger: Trigger2;
	turn_upside_down: boolean;
}

interface Trigger2 {
	name: string;
	url: string;
}

interface Species {
	name: string;
	url: string;
}

interface Species2 {
	name: string;
	url: string;
}

interface Species3 {
	name: string;
	url: string;
}
