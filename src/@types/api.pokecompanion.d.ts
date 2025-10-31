import type { paths } from './api';

export type APIPokemon =
	paths['/pokemon/{id}']['get']['responses']['200']['content']['application/json'];

export type APITag = paths['/tags']['get']['responses']['200']['content']['application/json'];
