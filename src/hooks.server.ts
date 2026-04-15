import { PRIVATE_API_HOST } from '$env/static/private';
import { PUBLIC_API_HOST } from '$env/static/public';
import type { HandleFetch } from '@sveltejs/kit';

// During SSR, any fetch that targets the Vite proxy (PUBLIC_API_HOST) is
// rewritten to go directly to the real API (PRIVATE_API_HOST) instead.
// This is necessary because the Vite proxy only handles browser requests —
// Node.js can't route through it, so SSR fetches would otherwise fail.
export const handleFetch: HandleFetch = ({ request, fetch }) => {
	if (request.url.startsWith(PUBLIC_API_HOST)) {
		const rewritten = request.url.replace(PUBLIC_API_HOST, PRIVATE_API_HOST);
		request = new Request(rewritten, request);
	}

	return fetch(request);
};
