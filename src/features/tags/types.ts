import type { components, paths } from '$/@types/api';

export type MinimalTagPokemon = Omit<
	NonNullable<components['schemas']['TagContents']['pokemon']>[number],
	'added'
>;

export type MinimalTagEntity = {
	pokemon?: MinimalTagPokemon | undefined;
};

export type APITag = paths['/tags']['get']['responses']['200']['content']['application/json'];
