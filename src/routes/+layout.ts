import type { APIMeta } from '$/@types/api.pokecompanion';
import { PUBLIC_API_HOST } from '$env/static/public';
import type { LayoutLoad } from './$types';
import { animateSprites, meta, selectedGame } from '$lib/stores/domain';
import { get } from 'svelte/store';
import { getAllTagsForUser } from '$/features/tags/api';
import { DEPEND_ALL_TAGS } from '$/features/tags/depends';
import { resolveSettings } from '$lib/api/settings';
import { getLoadFetch } from '$lib/api/loadFetch';

export const load: LayoutLoad = async ({ fetch, depends, data }) => {
	depends(DEPEND_ALL_TAGS);
	const runtimeFetch = getLoadFetch(fetch);

	// Resolve settings: on the server this uses cookie values from +layout.server.ts,
	// on the client this uses the live store values (initialised by cookieHandlers).
	const settings = resolveSettings(data.settings);

	async function getMeta() {
		const res = await runtimeFetch(`${PUBLIC_API_HOST}/meta`);

		return (await res.json()) as APIMeta;
	}

	try {
		const metaBody = await getMeta();
		// Update the meta store with the fetched data
		meta.set({
			games: metaBody.games,
			languages: metaBody.languages,
			lastPokedexEntry: metaBody.lastPokedexEntry,
			preferences: {
				animateSprites: get(animateSprites)
			}
		});

		if (get(selectedGame) === undefined) {
			selectedGame.set(metaBody.games[metaBody.games.length - 1]);
		}

		const tagBody = data.currentUser
					? await getAllTagsForUser(undefined, runtimeFetch)
					: {
							currentPage: 0,
							tags: [],
							totalPages: 0
						};


		return {
			...metaBody,
      tags: tagBody,
			currentUser: data.currentUser,
			settings
		};
	} catch (err) {
		console.error('Failed to get base system configuration', err);
		return {
			games: [],
			languages: [],
      lastPokedexEntry: 1,
			currentUser: data.currentUser,
			tags: {
				currentPage: 0,
				tags: [],
				totalPages: 0
			},
			settings
		};
	}
};
