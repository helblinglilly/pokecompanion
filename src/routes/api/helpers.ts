import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { getRawCookie, parseCookieString } from '$lib/utils/cookies';
import { addMinutesToDate } from '$lib/utils/date';
import type { Cookies } from '@sveltejs/kit';
import Pocketbase from 'pocketbase';
import type { IUserPreferences } from './types';
import { Logger } from '$lib/log';
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

export const validateAuth = async (request: Request, cookies: Cookies) => {
	const authCookie = getRawCookie(request.headers.get('cookie'), 'pb_auth');
	if (!authCookie) {
		return false;
	}

	const pb = new Pocketbase(PUBLIC_POCKETBASE_URL);
	pb.authStore.loadFromCookie(authCookie);

	try {
		if (!pb.authStore.isValid) {
			return false;
		}

		await pb.collection('users').authRefresh();

		const refreshedCookie = pb.authStore.exportToCookie({
			expires: addMinutesToDate(new Date(), 30)
		});
		const cookieValues = parseCookieString(refreshedCookie);
		const pbAuthObj = JSON.parse(cookieValues?.pb_auth ?? '{}');

		cookies.set('pb_auth', JSON.stringify(pbAuthObj), {
			expires: addMinutesToDate(new Date(cookieValues.Expires), 1209600 / 60),
			path: '/',
			sameSite: 'lax',
			httpOnly: cookieValues.httpOnly,
			secure: cookieValues.Secure
		});
	} catch (err) {
		Logger.warn('Failed to auth refresh with a signed in user', {
			error: Logger.buildError(err),
			request: request.url,
			user: cookies.get('remember-token')
		});
		return false;
	}
	return pb;
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
