import { browser } from '$app/environment';
import { PUBLIC_API_HOST } from '$env/static/public';

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);

export const isLocalBrowserDev = () =>
	browser && typeof window !== 'undefined' && LOCAL_HOSTS.has(window.location.hostname);

export const getClientApiHost = () => (isLocalBrowserDev() ? '/proxy' : PUBLIC_API_HOST);
