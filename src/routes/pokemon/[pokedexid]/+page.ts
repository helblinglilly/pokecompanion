import { error } from '@sveltejs/kit';
import type { IPokemonResponse } from '../../api/pokemon/types';


export const load = async ({ params, fetch }) => {
	const res = await fetch(`/api/pokemon/${params.pokedexid}`).catch((err) => {
		error(500, (err as unknown as Error).message)
	});

	if (!res.ok){
		if (res.status == 404){
			error(404, `${params.pokedexid} is outside the known range of Pokemon`)
		} else {
			error(500, `Failed to fetch API data - ${res.status}`)
		}
	}

	try {
		return await res.json() as IPokemonResponse;
	} catch {
		error(500, `Failed to parse JSON response from internal API - ${res.status}`)
	}
};
