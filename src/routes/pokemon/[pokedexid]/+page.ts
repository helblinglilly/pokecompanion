import { error } from '@sveltejs/kit';


export const load = async ({ params, fetch }) => {
	try {
		const res = await fetch(`/api/pokemon?pokemon=${params.pokedexid}`);
		if (!res.ok){
			throw new Error(`Failed to fetch API data`);
		}
		try {
			const body = await res.json();
			return body;
		} catch {
			throw new Error(`Failed to parse JSON response`);
		}
	} catch(err){
		error(500, err as unknown as Error)
	}
};
