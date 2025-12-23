import type { components } from '$/@types/api';

export type MinimalTagPokemon = Omit<
	NonNullable<components['schemas']['TagContents']['pokemon']>[number],
	'added'
>;
