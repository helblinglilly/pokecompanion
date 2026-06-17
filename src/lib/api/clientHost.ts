import { browser } from '$app/environment';
import { PUBLIC_API_HOST } from '$env/static/public';

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);
const PREVIEW_HOST_SUFFIX = '.pages.dev';
const LOCAL_PROXY_PREFIX = '/proxy';
const PREVIEW_PROXY_PREFIX = '/api-proxy';

const getBrowserApiHost = () => {
	if (!browser || typeof window === 'undefined') {
		return PUBLIC_API_HOST;
	}

	if (LOCAL_HOSTS.has(window.location.hostname)) {
		return LOCAL_PROXY_PREFIX;
	}

	if (window.location.hostname.endsWith(PREVIEW_HOST_SUFFIX)) {
		return PREVIEW_PROXY_PREFIX;
	}

	return PUBLIC_API_HOST;
};

export const isLocalBrowserDev = () =>
	browser && typeof window !== 'undefined' && LOCAL_HOSTS.has(window.location.hostname);

export const getClientApiHost = () => getBrowserApiHost();

export const rewriteApiUrlForBrowser = (input: string | URL) => {
	const url = typeof input === 'string' ? new URL(input, window.location.origin) : new URL(input);
	const apiOrigin = new URL(PUBLIC_API_HOST).origin;

	if (url.origin !== apiOrigin) {
		return url.toString();
	}

	const clientApiHost = getBrowserApiHost();
	if (clientApiHost === PUBLIC_API_HOST) {
		return url.toString();
	}

	return `${window.location.origin}${clientApiHost}${url.pathname}${url.search}${url.hash}`;
};
