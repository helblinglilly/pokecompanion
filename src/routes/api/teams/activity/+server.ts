import { Logger } from '$/lib/log';
import type { ITeam } from '$/lib/types/ITeams';
import { validateAuth } from '../../helpers';

export async function PATCH({ request, cookies, platform }) {
	const authedPb = await validateAuth(request, cookies);
	if (!authedPb) {
		return new Response('Not authorised', { status: 401 });
	}

	let body: { id: string | undefined; active: boolean };

	try {
		body = await request.json();
	} catch (err) {
		platform?.context.waitUntil(
			Logger.error(Logger.ErrorClasses.TeamOperation, Logger.buildError(err), {
				context: 'Setting a team to active',
				errorMessage: 'Failed to parse JSON from request body',
				user: cookies.get('remember-token')
			})
		);
		return new Response('Invalid body', {
			status: 400
		});
	}

	if (!body || !body.id) {
		return new Response('Empty body', {
			status: 400
		});
	}

	let existingEntry: ITeam | undefined;
	try {
		existingEntry = await authedPb.collection('teams').getOne(body.id);
		if (!existingEntry) {
			throw new Error('Returned as undefined');
		}
	} catch (err) {
		return new Response('Team does not exist', {
			status: 404
		});
	}

	if (existingEntry.owner !== authedPb.authStore.model?.id) {
		return new Response('You do not own this tag', {
			status: 401
		});
	}

	let allEntries: ITeam[] = [existingEntry];

	try {
		allEntries = await authedPb.collection('teams').getFullList({
			filter: `owner.id ~ "${authedPb.authStore.model.id}" && game = "${existingEntry.game}" && id != "${existingEntry.id}"`
		});

		await authedPb.collection('teams').update(existingEntry.id, {
			isActiveForGame: body.active
		});
	} catch (err) {
		return new Response('Something went wrong when grabbing all teams', {
			status: 500
		});
	}

	if (!body.active) {
		for (let i = 0; i < allEntries.length; i++) {
			try {
				if (allEntries[i]?.id) {
					await authedPb.collection('teams').update(allEntries[i].id, {
						isActiveForGame: false
					});
				}
			} catch (err) {
				return new Response('Something went wrong activating an existing entry', {
					status: 500
				});
			}
		}
	}

	return new Response('Ok', {
		status: 202
	});
}
