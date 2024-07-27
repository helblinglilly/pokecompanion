import { error } from '@sveltejs/kit';
import type { Actions } from './$types';
import { toSvg } from 'jdenticon';
import { isUsernameValid } from '$lib/server/user';
import { addDaysToDate, addMinutesToDate } from '$lib/utils/date';
import { parseCookieString } from '$lib/utils/cookies';
import { Logger } from '$lib/log';

export const actions: Actions = {
	signup: async ({ locals, request, cookies, platform }) => {
		const user = await request.formData();

		const data = Object.fromEntries(user) as {
			email: string;
			password: string;
			passwordConfirm: string;
			username?: string;
		};

		if (data.username) {
			const result = await isUsernameValid(data.username);

			if (!result.valid) {
				error(400, `Invalid username: ${result.message}`);
			}
		}

		const svgBlob = new Blob([toSvg(data.email, 128)], { type: 'image/svg+xml' });

		user.set('avatar', svgBlob, 'avatar.svg');

		try {
			await locals.pb.collection('users').create(user);
		} catch (e) {
			platform?.context.waitUntil(
				Logger.error(
					Logger.ErrorClasses.UserOperation,
					Logger.buildError(e),
					{
						user: cookies.get('remember-token'),
						email: data.email
					}
				)
			)
			throw e;
		}

		try {
			await locals.pb.collection('users').requestVerification(data.email);
			platform?.context.waitUntil(
				Logger.addPageAction('User', 'CreatedEmail', {
					user: cookies.get('remember-token'),
					email: data.email
				})
			)
		} catch (e) {
			console.error('Failed to request Email verification', e);
		}
	},

	login: async ({ locals, request, cookies, platform }) => {
		const data = Object.fromEntries(await request.formData()) as {
			email: string;
			password: string;
		};

		try {
			await locals.pb.collection('users').authWithPassword(data.email, data.password).catch((err) => {
				console.log (err);
				if (err.status === 400){
					return {
						status: 400
					}
				}
			});
			platform?.context.waitUntil(
				Logger.addPageAction('User', 'SignInEmail', {
					user: cookies.get('remember-token'),
					email: data.email
				})
			)

			/*
				exportToCookie gives us a cookie string that is ready to be used
				But svelte will only let us set cookies on the client through cookies.set
				which  means we have to provide each attribute on its own.
			*/
			const cookie = locals.pb.authStore.exportToCookie({
				expires: addDaysToDate(new Date(), 7)
			});
			const cookieValues = parseCookieString(cookie);
			const pbAuthObj = JSON.parse(cookieValues.pb_auth);

			cookies.set('pb_auth', JSON.stringify(pbAuthObj), {
				expires: new Date(cookieValues.Expires),
				path: '/',
				sameSite: 'lax',
				httpOnly: cookieValues.httpOnly,
				secure: cookieValues.Secure
			});

			return {
				status: 200
			};
		} catch (e) {
			platform?.context.waitUntil(
				Logger.warn('User', {
					context: 'SignInFailed',
					user: cookies.get('remember-token'),
					error: Logger.buildError(e).message
				})
			)

			throw e;
		}
	}
};
