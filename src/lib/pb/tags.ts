import { pb } from '$lib/pocketbase';
import type { ITagContents } from '$lib/types/ITags';

export interface ITags {
	name: string;
	isPrivate: boolean;
	created: Date;
	updated: Date;
	contents: ITagContents;
}

export const getTagsByUser = async (id: string): Promise<ITags[]> => {
	if (!id) {
		return [];
	}
	try {
		const tags = await pb.collection('tags').getFullList({
			sort: '-created',
			filter: `owner.id ~ "${id}"`
		});

		return tags.map((tag) => {
			return {
				name: tag.name,
				isPrivate: tag.isPrivate,
				created: new Date(tag.created),
				updated: new Date(tag.updated),
				contents: tag.contents
			};
		});
	} catch (err) {
		return [];
	}
};
