import type { paths } from '$/@types/api';

export type MinimalTagPokemon = {
	id: number;
	gender?: 'male' | 'female' | null;
	shiny?: boolean | null;
	variety?: string | null;
};

export type MinimalTagEntity = {
	pokemon?: MinimalTagPokemon | undefined;
};

export type APITag = paths['/tags']['get']['responses']['200']['content']['application/json'];
