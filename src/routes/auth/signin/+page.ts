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
	let oAuthMethods: IAuthProvider[] = [];
	try {
		const providers = (await pb.collection('users').listAuthMethods()) as IAuthMethodsResponse;
		oAuthMethods = providers.authProviders.map((method) => {
			return {
				...method,
				authUrl: (method.authUrl += oAuthRedirectUrl)
			};
		});
	} catch (err) {
		console.log(err);
	}

	return {
		oAuthMethods
	};
};
