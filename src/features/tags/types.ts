import type { components, paths } from '$/@types/api';

export type MinimalTagPokemon = Omit<
	NonNullable<components['schemas']['TagContents']['pokemon']>[number],
	'added'
>;

export type MinimalTagMove = Omit<
	NonNullable<components['schemas']['TagContents']['move']>[number],
	'added'
>;

export type APITag = paths['/tags']['get']['responses']['200']['content']['application/json'];
