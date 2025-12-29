export const DEPEND_ALL_TAGS = 'app:tags';
export const DEPEND_TAG_USER = (userId: string): `${string}:${string}` => `tag:user-${userId}`;
export const DEPEND_TAG_ID = (tagId: string): `${string}:${string}` => `tag:${tagId}`;
