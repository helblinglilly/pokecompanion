import type { HandleFetch } from '@sveltejs/kit';

const PROXY_PREFIX = '/proxy';
const REAL_API_HOST = 'https://api.pokecompanion.com';

// During SSR, any fetch that targets the Vite dev proxy is rewritten to go
// directly to the real API instead. The Vite proxy only handles browser
// requests — Node.js bypasses it entirely, so without this rewrite all
// server-side fetches would fail in local dev.
// In production no URLs contain PROXY_PREFIX, so this branch never fires.
export const handleFetch: HandleFetch = ({ request, fetch }) => {
	const url = new URL(request.url);

	if (url.pathname.startsWith(PROXY_PREFIX)) {
		const rewritten = new Request(
			REAL_API_HOST + url.pathname.slice(PROXY_PREFIX.length) + url.search,
			request
		);
		return fetch(rewritten);
	}

	return fetch(request);
};
