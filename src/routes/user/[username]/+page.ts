import type { PokeapiVersionNames } from '$/lib/data/games.js';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { Logger } from '$lib/log.js';
import { getUserByUsername } from '$lib/pb/publicUsers';
import type { ITag } from '$lib/types/ITags.js';
import { error } from '@sveltejs/kit';
import Pocketbase from 'pocketbase';
import type { RecordModel } from 'pocketbase';

type IRecordTag = ITag & RecordModel;



export const load = async ({ params }) => {
	const pb = new Pocketbase(PUBLIC_POCKETBASE_URL);
	const [user, freshTags, teams] = await Promise.all([
		getUserByUsername(params.username),
		pb.collection('tags').getFullList({
			filter: `owner.username ~ "${params.username}"`,
			sort: `-updated`
		}),
		pb.collection('teams').getFullList({
			 filter: `owner.username ~ "${params.username}"`,
			 fields: `id,name,game,description,isPrivate`,
			 sort: `-updated`
		}) as Promise<{id: string, name: string; game: PokeapiVersionNames, description: string, isPrivate: boolean}[]>
	]).catch(async (err) => {
		await Logger.error(
			Logger.ErrorClasses.TagOperation,
			Logger.buildError(err),
			{
				context: 'Failed to get tags for user',
				username: params.username,
			}
		)
		return [];
	});

	const tags = freshTags as IRecordTag[];

	if (!user) {
		error(404, 'This user does not exist');
	}
	return { user, tags, teams };
};
