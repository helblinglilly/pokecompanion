import type { components } from '$/@types/api';

export type MinimalTagPokemon = Omit<
	NonNullable<components['schemas']['TagContents']['pokemon']>[number],
	'added'
>;

export type MinimalTagMove = Omit<
	NonNullable<components['schemas']['TagContents']['move']>[number],
	'added'
>;
