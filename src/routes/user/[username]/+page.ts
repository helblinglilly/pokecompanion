import { getUserByUsername } from '$lib/pb/publicUsers';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const user = await getUserByUsername(params.username);

	if (!user) {
		throw error(404, {
			message: 'This user does not exist',
			errorId: '404UserNotFound'
		});
	}
	return { user };
};
