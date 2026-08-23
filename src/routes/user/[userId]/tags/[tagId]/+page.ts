import type { paths } from '$/@types/api.js';
import { PUBLIC_API_HOST } from '$env/static/public';
import { Logger } from '$/debt/log.js';
import { error } from '@sveltejs/kit';
import type { APITag } from '$/features/tags/types';
import { DEPEND_TAG_ID } from '$/features/tags/depends.js';
import { getLoadFetch } from '$lib/api/loadFetch';

export const load = async ({ params, fetch, depends }) => {
	depends(DEPEND_TAG_ID(params.tagId));
	const runtimeFetch = getLoadFetch(fetch);

	const tagRes = await runtimeFetch(`${PUBLIC_API_HOST}/tags/${params.tagId}`, {
		credentials: 'include'
	}).catch(async (err) => {
		await Logger.error(Logger.ErrorClasses.TagOperation, Logger.buildError(err), {
			context: 'When loading a specific tag page',
			tag: params.tagId
		});
		return;
	});

	if (!tagRes || !tagRes.ok) {
		error(404, 'This tag does not exist');
	}

	const tag = (await tagRes.json()) as APITag['tags'][number];
	if (tag.owner !== params.userId) {
		error(404, 'This tag does not exist');
	}

	async function getTagPokemon() {
		const tagPokemonRes = await runtimeFetch(`${PUBLIC_API_HOST}/tags/${params.tagId}/pokemon`, {
			credentials: 'include'
		});
		const tagPokemon: paths['/tags/{tagId}/pokemon']['get']['responses']['200']['content']['application/json'] =
			await tagPokemonRes.json();

		return tagPokemon;
	}
	return {
		tag,
		tagPokemon: getTagPokemon()
	};
};
