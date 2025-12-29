export const DEPEND_ALL_TAGS = 'app:tags';
export const DEPEND_TAG_USER = (username: string): `${string}:${string}` => `tag:user-${username}`;
export const DEPEND_TAG_ID = (tagId: string): `${string}:${string}` => `tag:${tagId}`;
