import type { APIMeta } from '$/@types/api.pokecompanion';
import { PUBLIC_API_HOST } from '$env/static/public';
import type { LayoutLoad } from './$types';
import { animateSprites, meta } from '$lib/stores/domain';
import { get } from 'svelte/store';

export const load: LayoutLoad = async ({ fetch }) => {
	try {
		const res = await fetch(`${PUBLIC_API_HOST}/meta`, {
			credentials: 'include'
		});

		const body = (await res.json()) as APIMeta;

		// Update the meta store with the fetched data
		meta.set({
			games: body.games,
			languages: body.languages,
			lastPokedexEntry: body.lastPokedexEntry,
			preferences: {
				animateSprites: get(animateSprites)
			}
		});

		return body;
	} catch (err) {
		console.error(`Failed to get the main config ${err}`);
	}
};
