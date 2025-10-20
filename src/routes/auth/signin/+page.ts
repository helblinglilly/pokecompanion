import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import Pocketbase, { type AuthProviderInfo } from 'pocketbase';

export const load = async (context) => {
	let oAuthMethods: Array<
		AuthProviderInfo & {
			authUrl: string;
		}
	> = [];
	try {
		const pb = new Pocketbase(PUBLIC_POCKETBASE_URL);
		const providers = await pb.collection('users').listAuthMethods();
		oAuthMethods = providers.oauth2.providers.map((method) => {
			return {
				...method,
				authUrl: (method.authURL += context.url.origin + '/auth/redirect')
			};
		});
	} catch (err) {
		console.log(err);
	}

	return {
		oAuthMethods
	};
};
