import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import Pocketbase from 'pocketbase';

interface IAuthMethodsResponse {
	usernamePassword: boolean;
	emailPassword: boolean;
	authProviders: IAuthProvider[];
}

export interface IAuthProvider {
	name: string;
	state: string;
	codeVerifier: string;
	codeChallenge: string;
	codeChallengeMethod: string;
	authUrl: string;
}

export const load = async (context) => {
	let oAuthMethods: IAuthProvider[] = [];
	try {
		const pb = new Pocketbase(PUBLIC_POCKETBASE_URL);
		const providers = (await pb.collection('users').listAuthMethods()) as IAuthMethodsResponse;
		oAuthMethods = providers.authProviders.map((method) => {
			return {
				...method,
				authUrl: (method.authUrl += context.url.origin + '/auth/redirect')
			};
		});
	} catch (err) {
		console.log(err);
	}

	return {
		oAuthMethods
	};
};
