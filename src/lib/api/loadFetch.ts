import { browser } from '$app/env';
import { PUBLIC_API_HOST } from '$app/env/public';
import { rewriteApiUrlForBrowser } from '#lib/api/clientHost.js';

export const getLoadFetch = (loadFetch: typeof globalThis.fetch): typeof globalThis.fetch => {
	if (!browser) {
		return (input, init) => {
			const url = URL.parse(input instanceof Request ? input.url : input);
			if (url && url.origin === new URL(PUBLIC_API_HOST).origin) {
				const request = new Request(input, init);
				request.headers.set('x-client', 'web');
				return globalThis.fetch(request);
			}
			return globalThis.fetch(input, init);
		};
	}

	return ((input, init) => {
		if (typeof input === 'string' || input instanceof URL) {
			return loadFetch(rewriteApiUrlForBrowser(input), init);
		}

		return loadFetch(new Request(rewriteApiUrlForBrowser(input.url), input), init);
	}) as typeof globalThis.fetch;
};
