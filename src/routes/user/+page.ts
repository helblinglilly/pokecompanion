import { PUBLIC_HOST_URL } from '$env/static/public';
import { pb } from '$lib/pocketbase';
import type { PageLoad } from './$types';

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
export const load: PageLoad = async () => {
	const providers = (await pb.collection('users').listAuthMethods()) as IAuthMethodsResponse;

	return {
		oAuthMethods: providers.authProviders.map((method) => {
			return {
				...method,
				authUrl: (method.authUrl += `${PUBLIC_HOST_URL}/auth/redirect`)
			};
		})
	};
};
