import { getUserByUsername } from '$lib/pb/publicUsers';
import { pb } from '$lib/pocketbase.js';
import type { ITag } from '$lib/types/ITags.js';
import { error } from '@sveltejs/kit';
import type { RecordModel } from 'pocketbase';

export const load = async ({ params }) => {
	const [user, freshTags] = await Promise.all([
		getUserByUsername(params.username),
		pb.collection('tags').getFullList({
			filter: `owner.username ~ "${params.username}"`
		})
	]);

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore Extends ITag[] and RecordModel[]
	const tags = freshTags as ITag[];

	if (!user) {
		throw error(404, {
			status: 404,
			message: 'This user does not exist',
			errorId: '404UserNotFound'
		});
	}
	return { user, tags };
};
