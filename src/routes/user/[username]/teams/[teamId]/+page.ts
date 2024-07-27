import type { ITeam } from '$/lib/types/ITeams.js';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { Logger } from '$lib/log.js';
import { getUserByUsername } from '$lib/pb/publicUsers';
import { error } from '@sveltejs/kit';
import Pocketbase from 'pocketbase';
import type { RecordModel } from 'pocketbase';

type IRecordTeam = ITeam & RecordModel;

export const load = async ({ params }) => {
	const pb = new Pocketbase(PUBLIC_POCKETBASE_URL);
	const [user, teamData] = await Promise.all([
		getUserByUsername(params.username),
		pb.collection('teams').getFirstListItem(`id="${params.teamId}"`) as Promise<IRecordTeam>
	]).catch(async (err) => {
		await Logger.error(
			Logger.ErrorClasses.TagOperation,
			Logger.buildError(err),
			{
				context: 'Failed to get teams for user',
				username: params.username,
			}
		)
		return [];
	});

	if (!user || !teamData) {
		error(404, 'This team does not exist');
	}

	return { user, teamData };
};
