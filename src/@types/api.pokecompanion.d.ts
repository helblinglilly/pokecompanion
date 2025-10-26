import type { paths } from './api';

export type APIPokemon =
	paths['/pokemon/{id}']['get']['responses']['200']['content']['application/json'];
