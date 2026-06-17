const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);
const PROXY_PREFIX = '/proxy';
const REAL_API_ORIGIN = 'https://api.pokecompanion.com';

export const isLocalAuthDev = (hostname: string) => LOCAL_HOSTS.has(hostname);

const toLocalProxyUrl = (url: URL, appOrigin: string) =>
	`${appOrigin}${PROXY_PREFIX}${url.pathname}${url.search}${url.hash}`;

export const rewriteAuthUrlForLocalDev = (authUrl: string, appOrigin: string) => {
	const url = new URL(authUrl);

	if (url.origin !== REAL_API_ORIGIN) {
		return authUrl;
	}

	for (const [key, value] of url.searchParams.entries()) {
		try {
			const nestedUrl = new URL(value);
			if (nestedUrl.origin === REAL_API_ORIGIN) {
				url.searchParams.set(key, toLocalProxyUrl(nestedUrl, appOrigin));
			}
		} catch {
			// Ignore non-URL params.
		}
	}

	return toLocalProxyUrl(url, appOrigin);
};

export const isAllowedAuthCallbackHost = (hostname: string, currentHostname: string) =>
	hostname === currentHostname ||
	hostname === 'pokecompanion.com' ||
	hostname.endsWith('.pokecompanion.com');
