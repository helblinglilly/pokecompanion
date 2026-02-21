import { PUBLIC_API_HOST } from '$env/static/public';
import { addSettingsToUrl, resolveSettings, DEPENDS_SETTINGS } from '$lib/api/settings';
import type { paths } from '$/@types/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch, url, parent, depends }) => {
	depends(DEPENDS_SETTINGS);
	const { settings: serverSettings } = await parent();
	const settings = resolveSettings(serverSettings);

	const requestUrl = addSettingsToUrl(
		new URL(`${PUBLIC_API_HOST}/move/${params.moveid}`),
		settings,
		url.searchParams
	);

	const res = await fetch(requestUrl, {
		credentials: 'include'
	});

	const move =
		(await res.json()) as paths['/move/{id}']['get']['responses']['200']['content']['application/json'];
	return {
		move
	};
};
