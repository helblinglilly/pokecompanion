import type { paths } from '$/@types/api.js';
import { PUBLIC_API_HOST } from '$env/static/public';
import { Logger } from '$/debt/log.js';
import { getUserByUsername } from '$/routes/user/[username]/tags/[tagId]/publicUsers';
import { error } from '@sveltejs/kit';
import type { APITag } from '$/features/tags/types';

export const load = async ({ params, fetch, depends }) => {
	depends(`tag:${params.tagId}`);

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

	async function getTagPokemon() {
		const tagPokemonRes = await fetch(`${PUBLIC_API_HOST}/tags/${params.tagId}/pokemon`, {
			credentials: 'include'
		});
		const tagPokemon: paths['/tags/{tagId}/pokemon']['get']['responses']['200']['content']['application/json'] =
			await tagPokemonRes.json();

		return tagPokemon;
	}
	async function getTagMoves() {
		try {
			const tagMoveRes = await fetch(`${PUBLIC_API_HOST}/tags/${params.tagId}/move`, {
				credentials: 'include'
			});
			const tagMove: paths['/tags/{tagId}/move']['get']['responses']['200']['content']['application/json'] =
				await tagMoveRes.json();

			return tagMove;
		} catch {
			return {
				moves: []
			};
		}
	}
	const tag = (await tagRes.json()) as APITag['tags'][number];

	return {
		user,
		tag,
		tagPokemon: getTagPokemon(),
		tagMoves: getTagMoves()
	};
};
