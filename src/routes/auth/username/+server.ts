import isStringToxic from '$lib/server/toxic.js';
import { validateAuth } from '../../api/helpers.js';
import { addMinutesToDate } from '$lib/utils/date.js';
import { Logger } from '$lib/log.js';

export async function PATCH({ request, cookies, platform }) {
	const pb = await validateAuth(request, cookies);
	if (!pb) {
		return new Response(null, {
			status: 401
		});
	}

	const { updatedUsername } = (await request.json()) as unknown as { updatedUsername: string };
	if (!updatedUsername) {
		return new Response(
			JSON.stringify({
				error: 'Did not provide a "updatedUsername" in request body"'
			}),
			{
				status: 400,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}

	const isToxic = await isStringToxic(updatedUsername);
	if (isToxic) {
		platform?.context.waitUntil(
			Logger.addPageAction(
				'ToxicityDenied',
				'A user tried to change their username to something toxic',
				{
					user: cookies.get('remember-token'),
					name: updatedUsername
				}
			)
		);

		return new Response('Something went wrong', {
			status: 500
		});
	}

	try {
		if (!pb.authStore.record) {
			throw new Error('authStore record was nullish');
		}
		await pb.collection('users').update(pb.authStore.record.id, {
			username: updatedUsername,
			avatar: pb.authStore.record.avatar
		});
	} catch (error) {
		Logger.error(Logger.ErrorClasses.UserOperation, new Error(`${error}`), {
			error,
			request,
			cookies
		});
		return new Response('Error when updating username', {
			status: 500
		});
	}

	return new Response(JSON.stringify({ score: 'yes' }), {
		headers: {
			'Content-Type': 'application/json',
			'set-cookie': pb.authStore.exportToCookie(
				{ expires: addMinutesToDate(new Date(), 30) },
				'pb_auth'
			)
		}
	});
}
