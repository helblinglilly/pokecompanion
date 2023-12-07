import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { getRawCookie, parseCookieString } from '$lib/utils/cookies';
import { addMinutesToDate } from '$lib/utils/date';
import type { LayoutServerLoad } from './$types';
import Pocketbase from 'pocketbase';

export const load: LayoutServerLoad = async ({ locals, request, cookies }) => {
	locals.pb = new Pocketbase(PUBLIC_POCKETBASE_URL);

	// Initialise from cookie
	const pbAuth = getRawCookie(request.headers.get('cookie'), 'pb_auth');
	locals.pb.authStore.loadFromCookie(pbAuth, 'pb_auth');

	// No credentials exist - continue
	if (!locals.pb.authStore.isValid) {
		// Entry is not valid - clean up and sign out
		locals.pb.authStore.clear();
		locals.user = null;
		cookies.delete('pb_auth');

		return {
			user: locals.user
		};
	}

	// Try to re-validate whenever we load fresh from the server
	try {
		await locals.pb.collection('users').authRefresh();

		const refreshedCookie = locals.pb.authStore.exportToCookie({
			expires: addMinutesToDate(new Date(), 30)
		});
		const cookieValues = parseCookieString(refreshedCookie);
		const pbAuthObj = JSON.parse(cookieValues.pb_auth);

		cookies.set('pb_auth', JSON.stringify(pbAuthObj), {
			expires: new Date(cookieValues.Expires),
			path: cookieValues.path,
			sameSite: 'lax',
			httpOnly: cookieValues.httpOnly,
			secure: cookieValues.Secure
		});

		locals.user = locals.pb.authStore.model;
	} catch (err) {
		// Login has expired now - sign user out
		locals.pb.authStore.clear();
		locals.user = null;
		cookies.delete('pb_auth');
	}

	return {
		user: locals.user
	};
};
