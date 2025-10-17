import { error } from '@sveltejs/kit';
import type { IPokemonResponse } from '../../api/pokemon/types';
import { SettingNames } from '$lib/stores/domain';
import { getGameGroupFromName, PokeapiVersionGroups } from '$lib/data/games';
import { Logger } from '$/lib/log';
import type { RecordTag } from '$/routes/api/tag/types';
import type { paths } from '$/@types/api';
import { PUBLIC_API_HOST } from '$env/static/public';

export const load = async ({ params, fetch, url, cookies }) => {
	const selfUrl = new URL(`${url.origin}/api/pokemon/${params.pokedexid}`);
	const newUrl = new URL(`${PUBLIC_API_HOST}/pokemon/v1/${params.pokedexid}`);

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
		const showGameSpecificPokemonSprites =
			url.searchParams.get(SettingNames.VersionSpecificPokemonSprites) ??
			cookies.get(SettingNames.VersionSpecificPokemonSprites);

		if (game && showGameSpecificPokemonSprites) {
			targetUrl.searchParams.append('game', game.pokeapi);
		}
	}

	appendSearchParams(selfUrl);
	appendSearchParams(newUrl);

	try {
		const [selfRequest, newRequest] = await Promise.all([fetch(selfUrl), fetch(newUrl)]);

		if (selfRequest.status === 404) {
			error(404, `${params.pokedexid} is outside the known range of Pokemon`);
		}

		const [oldData, newData] = await Promise.all([
			selfRequest.json() as Promise<IPokemonResponse>,
			newRequest.json() as Promise<
				paths['/pokemon/v1/{id}']['get']['responses']['200']['content']['application/json']
			>
		]);

		let tags: RecordTag[] = [];

		try {
			const authCookie = cookies.get('pb_auth');
			if (authCookie) {
				const res = await fetch('/api/tag');
				tags = (await res.json()) as RecordTag[];
			}
		} catch (err) {
			Logger.error(Logger.ErrorClasses.TagOperation, Logger.buildError(err), {
				context: 'Failed to fetch tags for user'
			});
		}

		return {
			...newData,
			...oldData,
			tags: tags
		};
	} catch (err) {
		console.error(err);
		error(500, `Failed to parse JSON response from internal API`);
	}
};
