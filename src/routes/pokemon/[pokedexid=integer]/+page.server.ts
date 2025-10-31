import type { APIPokemon, APITag } from '$/@types/api.pokecompanion';
import { Logger } from '$/lib/log';
import { PUBLIC_API_HOST } from '$env/static/public';
import { getGameGroupFromName, PokeapiVersionGroups } from '$lib/data/games';
import { SettingNames } from '$lib/stores/domain';
import { error } from '@sveltejs/kit';

export const ssr = true;

export const load = async ({ params, fetch, url, cookies }) => {
	const pokemonRequestUrl = new URL(`${PUBLIC_API_HOST}/pokemon/${params.pokedexid}`);

	function appendSearchParams(targetUrl: URL) {
		targetUrl.searchParams.append(
			SettingNames.PrimaryLanguage,
			url.searchParams.get(SettingNames.PrimaryLanguage) ??
				cookies.get(SettingNames.PrimaryLanguage) ??
				''
		);
		targetUrl.searchParams.append(
			SettingNames.SecondaryLanguage,
			url.searchParams.get(SettingNames.SecondaryLanguage) ??
				cookies.get(SettingNames.SecondaryLanguage) ??
				''
		);
		targetUrl.searchParams.append('variety', url.searchParams.get('variety') ?? '');
		targetUrl.searchParams.append('shiny', url.searchParams.get('shiny') ?? '');
		targetUrl.searchParams.append('gender', url.searchParams.get('gender') ?? '');
		targetUrl.searchParams.append(
			'animateSprites',
			url.searchParams.get('animateSprites') ?? `${cookies.get(SettingNames.AnimateSprites)}`
		);

		const game = getGameGroupFromName(
			(url.searchParams.get('game') as PokeapiVersionGroups) ??
				cookies.get(SettingNames.SelectedGame)
		);
		if (game) {
			targetUrl.searchParams.append('game', game.pokeapi);
		}

		const showGameSpecificPokemonSprites =
			url.searchParams.get(SettingNames.VersionSpecificPokemonSprites) ??
			cookies.get(SettingNames.VersionSpecificPokemonSprites);
		targetUrl.searchParams.append(
			'versionSpecificPokemonSprites',
			`${showGameSpecificPokemonSprites}`
		);

		const showGameSpecificTypeSprites =
			(url.searchParams.get(SettingNames.VersionSpecificPokemonSprites) ??
				cookies.get(SettingNames.VersionSpecificPokemonSprites)) === 'true';
		targetUrl.searchParams.append('versionSpecificTypeSprites', `${showGameSpecificTypeSprites}`);
	}

	appendSearchParams(pokemonRequestUrl);

	async function getTags(): Promise<APITag> {
		const authCookie = cookies.get('pb_auth');

		if (!authCookie) {
			return {
				currentPage: 1,
				totalPages: 1,
				tags: []
			};
		}

		try {
			const tagRequestUrl = new URL(`${PUBLIC_API_HOST}/tags`);

			const res = await fetch(tagRequestUrl);
			return (await res.json()) as APITag;
		} catch (err) {
			Logger.error(Logger.ErrorClasses.TagOperation, Logger.buildError(err), {
				context: 'Failed to fetch tags for user'
			});
		}

		return {
			currentPage: 1,
			totalPages: 1,
			tags: []
		};
	}

	try {
		const request = await fetch(pokemonRequestUrl);
		const body = (await request.json()) as APIPokemon;
		const tags = await getTags();

		return {
			...body,
			tags
		};
	} catch (err) {
		console.error(err);
		error(500, `Failed to parse JSON response from internal API`);
	}
};
