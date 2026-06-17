import type { paths } from '$/@types/api.js';
import { getLoadFetch } from '$lib/api/loadFetch';
import { addSettingsToUrl, resolveSettings, DEPENDS_SETTINGS } from '$lib/api/settings';
import { PUBLIC_API_HOST } from '$env/static/public';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, fetch, parent, depends }) => {
	depends(DEPENDS_SETTINGS);
	const runtimeFetch = getLoadFetch(fetch);
	const { settings: serverSettings } = await parent();
	const settings = resolveSettings(serverSettings);

	async function getHomeContents() {
		const homeUrl = addSettingsToUrl(
			new URL(`${PUBLIC_API_HOST}/home`),
			settings,
			url.searchParams
		);

		const res = await runtimeFetch(homeUrl);

		return (await res.json()) as paths['/home']['get']['responses']['200']['content']['application/json'];
	}

	return {
		data: getHomeContents()
	};
};
