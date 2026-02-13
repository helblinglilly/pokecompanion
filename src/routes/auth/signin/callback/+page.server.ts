import { PUBLIC_API_HOST } from '$env/static/public';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
	const cookieValue = cookies.get('authCallback');
	if (!cookieValue || cookieValue.length === 0) {
		redirect(307, '/');
	}

	const authCallbackUrl = new URL(cookieValue);

	if (!['http:', 'https:', 'exp:', 'apppokecompanion:'].includes(authCallbackUrl.protocol)) {
		console.error('Accessed auth with an unknown protocol');
		redirect(307, '/');
	}

	if (['http:', 'https:'].includes(authCallbackUrl.protocol)) {
		if (authCallbackUrl.hostname !== PUBLIC_API_HOST) {
			redirect(307, '/');
		}
	}

	const authToken = cookies.get('pb_auth');
	if (authToken) {
		authCallbackUrl.searchParams.set('token', authToken);
	}

	redirect(307, authCallbackUrl.toString());
}
