import { isAllowedAuthCallbackHost } from '#lib/utils/auth.js';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies, url }) {
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
		if (!isAllowedAuthCallbackHost(authCallbackUrl.hostname, url.hostname)) {
			redirect(307, '/');
		}
	}

	const authToken = cookies.get('pb_auth');
	if (authToken) {
		authCallbackUrl.searchParams.set('token', authToken);
	}

	// Callback URLs can be native-app schemes or an approved web host. SvelteKit 3
	// rejects external redirects unless they are explicitly permitted; the URL has
	// been validated above, so permit this final hand-off.
	redirect(307, authCallbackUrl.toString(), { external: true });
}
