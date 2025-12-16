import type { paths } from '$/@types/api';
import { PUBLIC_API_HOST } from '$env/static/public';
import type { Cookies } from '@sveltejs/kit';
import { SettingNames } from '../stores/domain';
import type { PokeapiVersionGroups } from '$/@types/api.pokecompanion';
import { getGameGroupFromName } from '../../debt/games';

export function addCookiesAsSearchParams(baseUrl: URL, requestUrl: URL, cookies: Cookies) {
	baseUrl.searchParams.append(
		SettingNames.PrimaryLanguage,
		requestUrl.searchParams.get(SettingNames.PrimaryLanguage) ??
			cookies.get(SettingNames.PrimaryLanguage) ??
			''
	);
	baseUrl.searchParams.append(
		SettingNames.SecondaryLanguage,
		requestUrl.searchParams.get(SettingNames.SecondaryLanguage) ??
			cookies.get(SettingNames.SecondaryLanguage) ??
			''
	);
	baseUrl.searchParams.append('variety', requestUrl.searchParams.get('variety') ?? '');
	baseUrl.searchParams.append('shiny', requestUrl.searchParams.get('shiny') ?? '');
	baseUrl.searchParams.append('gender', requestUrl.searchParams.get('gender') ?? '');
	baseUrl.searchParams.append(
		'animateSprites',
		requestUrl.searchParams.get('animateSprites') ?? `${cookies.get(SettingNames.AnimateSprites)}`
	);

	const game = getGameGroupFromName(
		(requestUrl.searchParams.get('game') as PokeapiVersionGroups) ??
			cookies.get(SettingNames.SelectedGame)
	);
	if (game) {
		baseUrl.searchParams.append('game', game.pokeapi);
	}

	const showGameSpecificPokemonSprites =
		requestUrl.searchParams.get(SettingNames.VersionSpecificPokemonSprites) ??
		cookies.get(SettingNames.VersionSpecificPokemonSprites);
	baseUrl.searchParams.append('versionSpecificPokemonSprites', `${showGameSpecificPokemonSprites}`);

	const showGameSpecificTypeSprites =
		(requestUrl.searchParams.get(SettingNames.VersionSpecificPokemonSprites) ??
			cookies.get(SettingNames.VersionSpecificPokemonSprites)) === 'true';
	baseUrl.searchParams.append('versionSpecificTypeSprites', `${showGameSpecificTypeSprites}`);

	return baseUrl;
}

export async function fetchPokemonPreview({
	id,
	shiny,
	gender,
	variety,
	sprites
}: {
	id: number;
	shiny?: boolean | undefined;
	gender?: string | undefined;
	variety?: string | undefined;
	sprites?:
		| {
				versionSpecificPokemonSprites?: boolean | undefined;
				game?: string | undefined;
		  }
		| undefined;
}) {
	const url = new URL(`${PUBLIC_API_HOST}/pokemon/${id}/preview`);

	if (shiny) {
		url.searchParams.append('shiny', 'true');
	}
	if (gender) {
		url.searchParams.append('gender', gender);
	}
	if (variety) {
		url.searchParams.append('variety', variety);
	}
	if (sprites) {
		url.searchParams.append('selectedGame', `${sprites.game}`);
		url.searchParams.append(
			'versionSpecificPokemonSprites',
			`${Boolean(sprites.versionSpecificPokemonSprites)}`
		);
	}

	const res = await fetch(url, {
		credentials: 'include'
	});

	if (res.status !== 200) {
		throw new Error(`Network error - non-200 status code for ${url}`);
	}

	const body: paths['/pokemon/{id}/preview']['get']['responses']['200']['content']['application/json'] =
		await res.json();

	return body;
}
