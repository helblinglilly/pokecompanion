import type { paths } from '$/@types/api';
import { PUBLIC_API_HOST } from '$env/static/public';

export const getAllTagsForUser = async (
	query: paths['/tags']['get']['parameters']['query'],
	propFetch?: typeof globalThis.fetch
) => {
	const fetchSafe = propFetch ?? fetch;

	const url = new URL(`/tags`, PUBLIC_API_HOST);
	if (query) {
		Object.entries(query).forEach(([key, value]) => {
			url.searchParams.append(key, value.toString());
		});
	}

	try {
		const res = await fetchSafe(url, {
			credentials: 'include'
		});

		if (res.status !== 200) {
			throw new Error(`Tried to get tags for current user but got HTTP ${res.status}`);
		}

		return (await res.json()) as paths['/tags']['get']['responses']['200']['content']['application/json'];
	} catch {
		return {
			currentPage: 0,
			tags: [],
			totalPages: 0
		} as paths['/tags']['get']['responses']['200']['content']['application/json'];
	}
};
