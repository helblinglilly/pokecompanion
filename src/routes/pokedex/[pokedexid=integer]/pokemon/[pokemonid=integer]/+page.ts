import type { paths } from '$/@types/api';
import type { APIPokemon } from '$/@types/api.pokecompanion';
import { addSettingsToUrl, resolveSettings, DEPENDS_SETTINGS } from '$lib/api/settings';
import { PUBLIC_API_HOST } from '$env/static/public';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params, url, parent, depends }) => {
	depends(DEPENDS_SETTINGS);
	const { settings: serverSettings } = await parent();
	const settings = resolveSettings(serverSettings);

	const pokemonDexRequestUrl = addSettingsToUrl(
		new URL(`${PUBLIC_API_HOST}/pokedex/${params.pokedexid}/pokemon/${params.pokemonid}`),
		settings,
		url.searchParams
	);

	const pokemonDexRes = await fetch(pokemonDexRequestUrl);

	if (pokemonDexRes.status !== 200) {
		throw new Error(`Tried to get a Pokedex Pokemon but got HTTP ${pokemonDexRes.status}`);
	}

	const pokemonDex =
		(await pokemonDexRes.json()) as paths['/pokedex/{pokedexId}/pokemon/{pokemonInPokedexId}']['get']['responses']['200']['content']['application/json'];

	const pokemonRes = await fetch(
		addSettingsToUrl(
			new URL(`${PUBLIC_API_HOST}/pokemon/${pokemonDex.navigation.current.speciesId}`),
			settings,
			url.searchParams
		)
	);

	if (pokemonRes.status !== 200) {
		throw new Error(`Tried to get a Pokemon but got HTTP ${pokemonRes.status}`);
	}
	const pokemon =
		(await pokemonRes.json()) as paths['/pokemon/{id}']['get']['responses']['200']['content']['application/json'];

	async function getFullAbility(ability: APIPokemon['abilities'][number]) {
		const abilityUrl = addSettingsToUrl(
			new URL(`${PUBLIC_API_HOST}/ability/${ability.id}`),
			settings,
			url.searchParams
		);

		const res = await fetch(abilityUrl);

		if (res.status !== 200) {
			throw new Error('Failed to get abilities');
		}

		return (await res.json()) as paths['/ability/{id}']['get']['responses']['200']['content']['application/json'];
	}

	async function getFullMoves() {
		const moveRequestUrl = addSettingsToUrl(
			new URL(`${PUBLIC_API_HOST}/pokemon/${params.pokedexid}/moves`),
			settings,
			url.searchParams
		);

		const request = await fetch(moveRequestUrl);

		if (request.status !== 200) {
			throw new Error('Failed to get moves');
		}
		return (await request.json()) as paths['/pokemon/{id}/moves']['get']['responses']['200']['content']['application/json'];
	}

	return {
		pokedex: pokemonDex,
		pokemon,
		abilities: pokemon.abilities.map((ability) => {
			return {
				...ability,
				data: getFullAbility(ability)
			};
		}),
		fullMoves: getFullMoves()
	};
};
