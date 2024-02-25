import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { logError } from '$lib/log.js';
import { getUserByUsername } from '$lib/pb/publicUsers';
import type { TagRecord } from '$lib/types/ITags';
import { error } from '@sveltejs/kit';
import Pocketbase from 'pocketbase';

export const load = async ({ params }) => {
	const pb = new Pocketbase(PUBLIC_POCKETBASE_URL);
	const [user, freshTags] = await Promise.all([
		getUserByUsername(params.username),
		pb.collection('tags').getOne(params.tagId)
	]).catch((err) => {
		logError(`Failed to get tag for user`, `GetTagFailed`, {
			error: err,
			user: params.username,
			tag: params.tagId
		});
		return [];
	});

	const tag = freshTags as TagRecord;

	if (!user) {
		error(404, 'This tag does not exist');
	}
	return { user, tag };
};
