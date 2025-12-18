import type { paths } from '$/@types/api.js';
import type { APIPokemon } from '$/@types/api.pokecompanion';
import { PUBLIC_API_HOST } from '$env/static/public';
import { error } from '@sveltejs/kit';
import { addCookiesAsSearchParams } from '$/lib/api/fetch';

export const load = async ({ params, fetch, url, cookies }) => {
	const pokemonRequestUrl = addCookiesAsSearchParams(
		new URL(`${PUBLIC_API_HOST}/pokemon/${params.pokedexid}`),
		url.searchParams,
		cookies
	);

	async function getFullAbility(ability: APIPokemon['abilities'][number]) {
		const abilityUrl = addCookiesAsSearchParams(
			new URL(`${PUBLIC_API_HOST}/ability/${ability.id}`),
			url.searchParams,
			cookies
		);

		const res = await fetch(abilityUrl, {
			credentials: 'include'
		});
		return (await res.json()) as paths['/ability/{id}']['get']['responses']['200']['content']['application/json'];
	}

	async function getFullMoves() {
		const moveRequestUrl = addCookiesAsSearchParams(
			new URL(`${PUBLIC_API_HOST}/pokemon/${params.pokedexid}/moves`),
			url.searchParams,
			cookies
		);

		const request = await fetch(moveRequestUrl, {
			credentials: 'include'
		});
		return (await request.json()) as paths['/pokemon/{id}/moves']['get']['responses']['200']['content']['application/json'];
	}

	try {
		const request = await fetch(pokemonRequestUrl, {
			credentials: 'include'
		});
		const body = (await request.json()) as APIPokemon;

		return {
			...body,
			abilities: body.abilities.map((ability) => {
				return {
					...ability,
					data: getFullAbility(ability)
				};
			}),
			fullMoves: getFullMoves()
		};
	} catch (err) {
		console.error(err);
		error(500, `Failed to parse JSON response from internal API`);
	}
};
