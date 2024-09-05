import Pocketbase from 'pocketbase';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { Logger } from '$lib/log';
import type { RecordTag } from '$/routes/api/tag/types';

export const getTagsByUser = async (id: string): Promise<RecordTag[]> => {
	if (!id) {
		return [];
	}
	const pb = new Pocketbase(PUBLIC_POCKETBASE_URL);

	try {
		const tags = await pb.collection('tags').getFullList({
			sort: '-created',
			filter: `owner.id ~ "${id}"`
		}) as RecordTag[]

		return tags;
	} catch (err) {
		await Logger.error(
			Logger.ErrorClasses.TagOperation,
			Logger.buildError(err),
			{
				context: 'Failed to get Tags by user',
				user: id
			}
		)
		return [];
	}
};
