import type { SignedInUser } from '$lib/stores/user.js';
import isStringToxic from '$lib/server/toxic.js';
import { validateAuth } from '../../api/helpers.js';

export async function PATCH({ request }) {
	const pb = await validateAuth(request);
	if (!pb) {
		return new Response(null, {
			status: 401
		});
	}

	const { updatedUsername } = await request.json();
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
		console.log(`Toxic username has been shown 500: ${updatedUsername}`);
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
		console.error(error);
		return new Response('Error when updating username', {
			status: 500
		});
	}

	// Refreshing auth here is not working correctly
	// Vulnerable to replay attacks after user has signed out
	return new Response(JSON.stringify({ score: 'yes' }), {
		headers: {
			'Content-Type': 'application/json',
			'set-cookie': pb.authStore.exportToCookie()
		}
	});
}
