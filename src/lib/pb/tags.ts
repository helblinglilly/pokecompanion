import Pocketbase from 'pocketbase';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import type { ITagContents } from '$lib/types/ITags';
import { warn } from '$lib/log';

export interface ITags {
	id: string;
	name: string;
	isPrivate: boolean;
	created: Date;
	updated: Date;
	contents: ITagContents;
	showShinyAndGender: boolean;
}

export const getTagsByUser = async (id: string): Promise<ITags[]> => {
	if (!id) {
		return [];
	}
	const pb = new Pocketbase(PUBLIC_POCKETBASE_URL);
	try {
		const tags = await pb.collection('tags').getFullList({
			sort: '-created',
			filter: `owner.id ~ "${id}"`
		});

		return tags.map((tag) => {
			return {
				id: tag.id,
				name: tag.name,
				isPrivate: tag.isPrivate,
				created: new Date(tag.created),
				updated: new Date(tag.updated),
				contents: tag.contents,
				showShinyAndGender: true
			};
		});
	} catch (err) {
		warn(`Failed to get tags by user`, `TagLoadFailed`, {
			error: err,
			userId: id
		});
		return [];
	}
};
