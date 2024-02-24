import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { warn } from '$lib/log';
import { getRawCookie, parseCookieString } from '$lib/utils/cookies';
import { addMinutesToDate } from '$lib/utils/date';
import type { Cookies } from '@sveltejs/kit';
import Pocketbase from 'pocketbase';

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
			result = val;
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
		const pbAuthObj = JSON.parse(cookieValues.pb_auth);

		cookies.set('pb_auth', JSON.stringify(pbAuthObj), {
			expires: new Date(cookieValues.Expires),
			path: '/',
			sameSite: 'lax',
			httpOnly: cookieValues.httpOnly,
			secure: cookieValues.Secure
		});
	} catch (err) {
		warn('Failed to auth refresh with a signed in user', `FailedAuthRefresh`, {
			cookies: cookies,
			request: request
		});
		return false;
	}
	return pb;
};
