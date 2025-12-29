import type { paths } from '$/@types/api';
import { PUBLIC_API_HOST } from '$env/static/public';

export const getAllPokedexes = async (propFetch?: typeof globalThis.fetch) => {
	const fetchSafe = propFetch ?? fetch;

	const url = new URL(`/pokedex`, PUBLIC_API_HOST);

	try {
		const res = await fetchSafe(url, {
			credentials: 'include'
		});

		if (res.status !== 200) {
			throw new Error(`Tried to get all pokedexes but got HTTP ${res.status}`);
		}

		return (await res.json()) as paths['/pokedex']['get']['responses']['200']['content']['application/json'];
	} catch {
		return {} as paths['/pokedex']['get']['responses']['200']['content']['application/json'];
	}
};
