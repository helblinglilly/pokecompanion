import type { APIMeta } from '$/@types/api.pokecompanion';
import { PUBLIC_API_HOST } from '$env/static/public';
import type { LayoutLoad } from './$types';
import { animateSprites, meta, selectedGame } from '$lib/stores/domain';
import { get } from 'svelte/store';
import type { paths } from '$/@types/api';

export const load: LayoutLoad = async (a) => {
	const { fetch, depends } = a;
	depends('app:tags');

	async function getMeta() {
		const res = await fetch(`${PUBLIC_API_HOST}/meta`, {
			credentials: 'include'
		});

		return (await res.json()) as APIMeta;
	}

	async function getTags(): Promise<
		paths['/tags']['get']['responses']['200']['content']['application/json']
	> {
		try {
			const res = await fetch(`${PUBLIC_API_HOST}/tags`, {
				credentials: 'include'
			});

			return await res.json();
		} catch {
			return {
				currentPage: 0,
				tags: [],
				totalPages: 0
			};
		}
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

		const tagBody = await getTags();

		return {
			...metaBody,
			tags: tagBody
		};
	} catch (err) {
		console.error(`Failed to get the main config ${err}`);
	}
};
