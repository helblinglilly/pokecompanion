import { PUBLIC_API_HOST } from '$env/static/public';
import type { RequestHandler } from './$types';

const HOP_BY_HOP_HEADERS = new Set([
	'connection',
	'content-length',
	'host',
	'transfer-encoding'
]);

const FORWARDED_REQUEST_HEADERS = new Set(['accept', 'authorization', 'content-type', 'cookie']);

const proxyRequest: RequestHandler = async ({ request, params, url, fetch }) => {
	const upstreamUrl = new URL(`${PUBLIC_API_HOST}/${params.path}`);
	upstreamUrl.search = url.search;

	const headers = new Headers();
	for (const [name, value] of request.headers.entries()) {
		const lowerName = name.toLowerCase();
		if (HOP_BY_HOP_HEADERS.has(lowerName)) {
			continue;
		}
		if (!FORWARDED_REQUEST_HEADERS.has(lowerName)) {
			continue;
		}
		headers.set(name, value);
	}

	// The API rejects preview Origins via its CORS middleware.
	// Strip browser Origin by default so proxy requests behave like server-to-server calls.
	headers.delete('origin');

	// /auth/methods requires an Origin header to be present, but it only needs to be allowed,
	// not to match the preview host. Use the API origin so preview builds can still bootstrap auth.
	if (params.path === 'auth/methods') {
		headers.set('origin', PUBLIC_API_HOST);
	}

	const upstreamResponse = await fetch(upstreamUrl, {
		method: request.method,
		headers,
		body: request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.arrayBuffer(),
		redirect: 'manual'
	});

	const responseHeaders = new Headers(upstreamResponse.headers);
	for (const header of HOP_BY_HOP_HEADERS) {
		responseHeaders.delete(header);
	}

	return new Response(upstreamResponse.body, {
		status: upstreamResponse.status,
		statusText: upstreamResponse.statusText,
		headers: responseHeaders
	});
};

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;
