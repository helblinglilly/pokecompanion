import type { Cookies } from '@sveltejs/kit';

export interface IServerRequestDetails {
	request: Request;
	cookies: Cookies;
}
