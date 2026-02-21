import type { paths } from '$/@types/api.js';
import { addSettingsToUrl, resolveSettings, DEPENDS_SETTINGS } from '$lib/api/settings';
import { PUBLIC_API_HOST } from '$env/static/public';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url, parent, depends }) => {
	depends(DEPENDS_SETTINGS);
	const { settings: serverSettings } = await parent();
	const settings = resolveSettings(serverSettings);

	const searchRequestUrl = addSettingsToUrl(
		new URL(`${PUBLIC_API_HOST}/search?term=${url.searchParams.get('term')}`),
		settings,
		url.searchParams
	);

	const res = await fetch(searchRequestUrl, {
		credentials: 'include'
	});
	const body =
		(await res.json()) as paths['/search']['get']['responses']['200']['content']['application/json'];

	return {
		...body,
		errorMessage: ''
	};
};
