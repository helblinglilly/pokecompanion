import type { APITag } from '$/@types/api.pokecompanion';
import { PUBLIC_API_HOST } from '$env/static/public';
import { Logger } from '$lib/log.js';
import { getUserByUsername } from '$lib/pb/publicUsers';
import { error } from '@sveltejs/kit';

export const load = async ({ params, fetch }) => {
	const [user, tagRes] = await Promise.all([
		getUserByUsername(params.username),
		await fetch(`${PUBLIC_API_HOST}/tags/${params.tagId}`, {
			credentials: 'include'
		})
	]).catch(async (err) => {
		await Logger.error(Logger.ErrorClasses.TagOperation, Logger.buildError(err), {
			context: 'When loading a specific tag page',
			username: params.username,
			tag: params.tagId
		});
		return [];
	});

	if (!user) {
		error(404, 'This tag does not exist');
	}

	const tag = (await tagRes.json()) as APITag['tags'][number];

	return { user, tag };
};
