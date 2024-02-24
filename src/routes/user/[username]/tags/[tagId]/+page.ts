import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { getUserByUsername } from '$lib/pb/publicUsers';
import type { ITag } from '$lib/types/ITags.js';
import { error } from '@sveltejs/kit';
import Pocketbase from 'pocketbase';
// import type { RecordModel } from 'pocketbase';

export const load = async ({ params }) => {
	const pb = new Pocketbase(PUBLIC_POCKETBASE_URL);
	const [user, freshTags] = await Promise.all([
		getUserByUsername(params.username),
		pb.collection('tags').getOne(params.tagId)
	]);

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore Extends ITag[] and RecordModel[]
	const tag = freshTags as ITag;

	if (!user) {
		error(404, {
			status: 404,
			message: 'This user does not exist',
			errorId: '404UserNotFound'
		});
	}
	return { user, tag };
};
