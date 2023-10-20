import type { Actions } from './$types';
import { toSvg } from 'jdenticon';

export const actions: Actions = {
	signup: async ({ locals, request }) => {
		const user = await request.formData();

		const data = Object.fromEntries(user) as {
			email: string;
			password: string;
			passwordConfirm: string;
		};

		const svgBlob = new Blob([toSvg(data.email, 128)], { type: 'image/svg+xml' });

		user.set('avatar', svgBlob, 'avatar.svg');

		try {
			await locals.pb.collection('users').create(user);
		} catch (e) {
			console.error(e);
			throw e;
		}
	},

	login: async ({ locals, request }) => {
		const data = Object.fromEntries(await request.formData()) as {
			email: string;
			password: string;
		};

		try {
			await locals.pb.collection('users').authWithPassword(data.email, data.password);
		} catch (e) {
			console.error(e);
			throw e;
		}
	}
};
