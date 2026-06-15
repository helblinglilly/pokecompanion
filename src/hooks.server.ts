import type { HandleFetch } from '@sveltejs/kit';
import { PUBLIC_API_HOST } from '$env/static/public';
import { PRIVATE_API_HOST } from '$env/static/private';

const PROXY_PREFIX = '/proxy';

// During SSR, any fetch that targets the Vite dev proxy is rewritten to go
// directly to the real API instead. The Vite proxy only handles browser
// requests — Node.js bypasses it entirely, so without this rewrite all
// server-side fetches would fail in local dev.
// In production no URLs contain PROXY_PREFIX, so this branch never fires.
//
// Additionally, if a PRIVATE_API_HOST is configured, any SSR fetch targeting
// PUBLIC_API_HOST is rewritten to PRIVATE_API_HOST so internal network
// routing is used instead of the public-facing URL.
export const handleFetch: HandleFetch = ({ request, fetch }) => {
	const url = new URL(request.url);

	if (url.pathname.startsWith(PROXY_PREFIX)) {
		const rewritten = new Request(
			PRIVATE_API_HOST + url.pathname.slice(PROXY_PREFIX.length) + url.search,
			request
		);
		return fetch(rewritten);
	}

	if (PRIVATE_API_HOST && PUBLIC_API_HOST && request.url.startsWith(PUBLIC_API_HOST)) {
		const rewritten = new Request(request.url.replace(PUBLIC_API_HOST, PRIVATE_API_HOST), request);
		return fetch(rewritten);
	}

	return fetch(request);
};
