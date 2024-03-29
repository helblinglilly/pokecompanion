import type { SignedInUser } from '$lib/stores/user.js';
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
			Logger.addPageAction('ToxicityDenied', 'A user tried to change their username to something toxic', {
				user: cookies.get('remember-token'),
				name: updatedUsername,
			})
		)

		return new Response('Something went wrong', {
			status: 500
		});
	}

	try {
		const currentUser = pb.authStore.model as SignedInUser;
		await pb.collection('users').update(currentUser.id, {
			username: updatedUsername,
			avatar: currentUser.avatar
		});
	} catch (error) {
		logError(`Error when updating username`, `FailedUpdateUsername`, {
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
