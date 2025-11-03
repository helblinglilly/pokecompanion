import type { paths } from './api';

export type APIPokemon =
	paths['/pokemon/{id}']['get']['responses']['200']['content']['application/json'];

export type APITag = paths['/tags']['get']['responses']['200']['content']['application/json'];

export type APITagCreateRequestBody =
	paths['/tags']['post']['requestBody']['content']['application/json']['contents'];

export type ITag = NonNullable<
	paths['/tags/{tagId}']['get']['responses']['200']['content']['application/json']
>;
export type ITagContents = ITag['contents'];
export type ITagMove = NonNullable<ITag['contents']['move']>[number];
export type ITagPokemon = NonNullable<ITag['contents']['pokemon']>[number];
