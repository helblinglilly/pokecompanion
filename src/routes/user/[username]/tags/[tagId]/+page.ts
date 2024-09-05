import type { RecordTag } from '$/routes/api/tag/types.js';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { Logger } from '$lib/log.js';
import { getUserByUsername } from '$lib/pb/publicUsers';
import { error } from '@sveltejs/kit';
import Pocketbase from 'pocketbase';

export const load = async ({ params }) => {
	const pb = new Pocketbase(PUBLIC_POCKETBASE_URL);
	const [user, tag] = await Promise.all([
		getUserByUsername(params.username),
		pb.collection('tags').getOne(params.tagId) as Promise<RecordTag>
	]).catch(async (err) => {
		await Logger.error(
			Logger.ErrorClasses.TagOperation,
			Logger.buildError(err),
			{
				context: 'When loading a specific tag page',
				username: params.username,
				tag: params.tagId
			}
		)
		return [];
	});

	if (!user) {
		error(404, 'This tag does not exist');
	}

	console.log(tag);
	return { user, tag };
};
