import { PUBLIC_API_HOST } from '$env/static/public';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const response = await fetch(`${PUBLIC_API_HOST}/health`);

	if (response.ok) {
		return new Response(null, { status: 200 });
	}

	return new Response(null, { status: 503 });
};
