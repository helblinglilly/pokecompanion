import type { paths } from '$/@types/api';
import { PUBLIC_API_HOST } from '$env/static/public';
import type { Cookies } from '@sveltejs/kit';
import { SettingNames } from '../stores/domain';

export function addCookiesAsSearchParams(
	baseUrl: URL,
	searchParams: URLSearchParams,
	cookies: Cookies
) {
	baseUrl.searchParams.append(
		SettingNames.PrimaryLanguage,
		searchParams.get(SettingNames.PrimaryLanguage) ??
			cookies.get(SettingNames.PrimaryLanguage) ??
			''
	);
	baseUrl.searchParams.append(
		SettingNames.SecondaryLanguage,
		searchParams.get(SettingNames.SecondaryLanguage) ??
			cookies.get(SettingNames.SecondaryLanguage) ??
			''
	);
	baseUrl.searchParams.append('variety', searchParams.get('variety') ?? '');
	baseUrl.searchParams.append('shiny', searchParams.get('shiny') ?? '');
	baseUrl.searchParams.append('gender', searchParams.get('gender') ?? '');
	baseUrl.searchParams.append(
		'animateSprites',
		searchParams.get('animateSprites') ?? `${cookies.get(SettingNames.AnimateSprites)}`
	);

	const game = searchParams.get('game') ?? cookies.get(SettingNames.SelectedGame);
	if (game) {
		baseUrl.searchParams.append('game', game);
	}

	const showGameSpecificPokemonSprites =
		searchParams.get(SettingNames.VersionSpecificPokemonSprites) ??
		cookies.get(SettingNames.VersionSpecificPokemonSprites);
	baseUrl.searchParams.append('versionSpecificPokemonSprites', `${showGameSpecificPokemonSprites}`);

	const showGameSpecificTypeSprites =
		(searchParams.get(SettingNames.VersionSpecificPokemonSprites) ??
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
