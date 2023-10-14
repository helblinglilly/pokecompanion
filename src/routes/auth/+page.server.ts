import type { Actions } from './$types';

export const actions: Actions = {
	signup: async ({ locals, request }) => {
		const data = Object.fromEntries(await request.formData()) as {
			email: string;
			password: string;
			passwordConfirm: string;
		};

		try {
			await locals.pb.collection('users').create(data);
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
			const response = await locals.pb
				.collection('users')
				.authWithPassword(data.email, data.password);
			return response.record.username;
		} catch (e) {
			console.error(e);
			throw e;
		}
	}
};
