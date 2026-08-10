import { browser } from '$app/environment';
import type { Handle, HandleFetch } from '@sveltejs/kit';
import { SettingNames } from '$lib/stores/domain';

const PROXY_PREFIX = '/proxy';
const REAL_API_HOST = 'https://api.pokecompanion.com';
const PUBLIC_CACHE_TTL_SECONDS = 600;

const RENDERING_COOKIES = [
	SettingNames.PrimaryLanguage,
	SettingNames.SecondaryLanguage,
	SettingNames.SelectedGame,
	SettingNames.AnimateSprites,
	SettingNames.VersionSpecificPokemonSprites,
	SettingNames.VersionSpecificTypeSprites
] as const;

const isCacheablePublicPage = (pathname: string) =>
	!['/api-proxy', '/auth', '/user', '/settings', '/feedback', '/app'].some(
		(prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
	);

const getCacheRequest = (
	request: Request,
	cookies: { get: (name: string) => string | undefined }
) => {
	const url = new URL(request.url);
	const renderingVariant = new URLSearchParams();

	for (const cookie of RENDERING_COOKIES) {
		renderingVariant.set(cookie, cookies.get(cookie) ?? '');
	}

	// Cache API keys are URLs. Keep the variant internal so it cannot affect routing or page data.
	url.searchParams.set('__pc_rendering', renderingVariant.toString());
	return new Request(url.toString(), { method: 'GET' });
};

export const handle: Handle = async ({ event, resolve }) => {
	const { request, url, cookies } = event;

	// User-specific pages can include account data or Set-Cookie headers and must never be shared.
	if (request.method !== 'GET' || cookies.get('pb_auth') || !isCacheablePublicPage(url.pathname)) {
		return resolve(event);
	}

	const cache = event.platform?.caches.default;
	// The platform cache is only available in the Cloudflare Worker runtime.
	if (!cache) {
		return resolve(event);
	}
	const cacheRequest = getCacheRequest(request, cookies);
	const cachedResponse = await cache.match(cacheRequest);
	if (cachedResponse) {
		return cachedResponse;
	}

	const response = await resolve(event);
	const contentType = response.headers.get('content-type') ?? '';
	if (!response.ok || !contentType.includes('text/html')) {
		return response;
	}

	const responseForCache = response.clone();
	const cacheHeaders = new Headers(responseForCache.headers);
	// The cached copy is anonymous; never persist a cookie set during rendering.
	cacheHeaders.delete('set-cookie');
	cacheHeaders.set(
		'cache-control',
		`public, max-age=0, s-maxage=${PUBLIC_CACHE_TTL_SECONDS}, stale-while-revalidate=86400`
	);

	const cacheResponse = new Response(responseForCache.body, {
		status: responseForCache.status,
		statusText: responseForCache.statusText,
		headers: cacheHeaders
	});

	// Cloudflare Cache API only accepts complete responses; preserve the unmodified response for the user.
	event.platform?.ctx.waitUntil(cache.put(cacheRequest, cacheResponse.clone()));
	return response;
};

// During SSR, any fetch that targets the Vite dev proxy is rewritten to go
// directly to the real API instead. The Vite proxy only handles browser
// requests — Node.js bypasses it entirely, so without this rewrite all
// server-side fetches would fail in local dev.
// In production no URLs contain PROXY_PREFIX, so this branch never fires.
export const handleFetch: HandleFetch = ({ request, fetch }) => {
	if (!browser) {
		const url = new URL(request.url);

		if (url.pathname.startsWith(PROXY_PREFIX)) {
			const rewritten = new Request(
				REAL_API_HOST + url.pathname.slice(PROXY_PREFIX.length) + url.search,
				request
			);
			return fetch(rewritten);
		}
	}

	return fetch(request);
};
