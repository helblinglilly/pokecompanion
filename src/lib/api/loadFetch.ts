import { browser } from '$app/environment';
import { rewriteApiUrlForBrowser } from '$lib/api/clientHost';

export const getLoadFetch = (loadFetch: typeof globalThis.fetch): typeof globalThis.fetch => {
	if (!browser) {
		return globalThis.fetch;
	}

	return ((input, init) => {
		if (typeof input === 'string' || input instanceof URL) {
			return loadFetch(rewriteApiUrlForBrowser(input), init);
		}

		return loadFetch(new Request(rewriteApiUrlForBrowser(input.url), input), init);
	}) as typeof globalThis.fetch;
};
