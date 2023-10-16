import { pb } from '$lib/pocketbase';
import { oAuthRedirectUrl } from '$lib/stores/domain';

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
export const load = async () => {
	const providers = (await pb.collection('users').listAuthMethods()) as IAuthMethodsResponse;

	return {
		oAuthMethods: providers.authProviders.map((method) => {
			return {
				...method,
				authUrl: (method.authUrl += oAuthRedirectUrl)
			};
		})
	};
};
