import type { Cookies } from '@sveltejs/kit';
import type { IUserPreferences } from './types';
import { getGameGroupFromName } from '$lib/data/games';
import { SettingNames, type UserPreferencePokemonVersion } from '$lib/stores/domain';

export const getSearchParam = (url: string, name: string) => {
	const searchParts = url.split('?')[1];
	if (!searchParts) {
		return;
	}
	const result = searchParts.split('&').find((keypair) => {
		const [key] = keypair.split('=');
		return key === name;
	});

	if (!result) {
		return;
	}

	return result.split('=')[1];
};

export const getCookies = (request: Request) => {
	let result = '';
	request.headers.forEach((val, key) => {
		if (key === 'cookie') {
			result = val;
		}
	});
	return result;
};

export const getCookieValue = (request: Request, name: string) => {
	const cookieValues = getCookies(request);
	if (!cookieValues) {
		return '';
	}

	const values = cookieValues.split('; ');
	let result = '';
	values.find((value) => {
		const [key, val] = value.split('=');
		if (key === name) {
			result = val ?? '';
		}
	});
	return result;
};

export const respondWithJson = (
	payload: object | Array<unknown>,
	status?: number,
	shouldCache?: boolean
) => {
	const responseCode = status ?? payload ? 200 : 204;

	return new Response(JSON.stringify(payload), {
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control':
				(!status || (status >= 200 && status < 400)) && shouldCache
					? 'public, max-age=21600'
					: 'no-store'
		},
		status: responseCode
	});
};

export const parseUserPreferences = (url: URL, cookies: Cookies): IUserPreferences => {
	const gameEntry = getGameGroupFromName(
		(url.searchParams.get('game') as UserPreferencePokemonVersion) ??
			(cookies.get('game') as UserPreferencePokemonVersion)
	);
	const primaryLanguage =
		url.searchParams.get(SettingNames.PrimaryLanguage) ??
		cookies.get(SettingNames.PrimaryLanguage) ??
		'en';
	const secondaryLanguage =
		url.searchParams.get(SettingNames.SecondaryLanguage) ??
		cookies.get(SettingNames.SecondaryLanguage);
	const animateSprites =
		url.searchParams.get(SettingNames.AnimateSprites) === 'true' ||
		cookies.get(SettingNames.AnimateSprites) === 'true';

	return {
		selectedGame: gameEntry,
		primaryLanguage,
		secondaryLanguage,
		animateSprites
	};
};
