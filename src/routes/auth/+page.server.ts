import { error } from '@sveltejs/kit';
import type { Actions } from './$types';
import { toSvg } from 'jdenticon';
import { isUsernameValid } from '$lib/server/user';
import { addMinutesToDate } from '$lib/utils/date';
import { parseCookieString } from '$lib/utils/cookies';
import { logToAxiom } from '$lib/log';

export const actions: Actions = {
	signup: async ({ locals, request, cookies }) => {
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
				error(400, {
                					status: 400,
                					message: `Invalid username: ${result.message}`,
                					errorId: '400InvalidUsername'
                				});
			}
		}

		const svgBlob = new Blob([toSvg(data.email, 128)], { type: 'image/svg+xml' });

		user.set('avatar', svgBlob, 'avatar.svg');

		try {
			await locals.pb.collection('users').create(user);
		} catch (e) {
			console.error(e);
			throw e;
		}

		try {
			await locals.pb.collection('users').requestVerification(data.email);
			logToAxiom({ action: 'userCreated' }, request, cookies);
		} catch (e) {
			console.error('Failed to request Email verification', e);
		}
	},

	login: async ({ locals, request, cookies }) => {
		const data = Object.fromEntries(await request.formData()) as {
			email: string;
			password: string;
		};

		try {
			await locals.pb.collection('users').authWithPassword(data.email, data.password);
			logToAxiom({ action: 'emailSignIn' }, request, cookies);

			/*
				exportToCookie gives us a cookie string that is ready to be used
				But svelte will only let us set cookies on the client through cookies.set
				which  means we have to provide each attribute on its own.
			*/
			const cookie = locals.pb.authStore.exportToCookie({
				expires: addMinutesToDate(new Date(), 30)
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
			console.error(e);

			throw e;
		}
	}
};
