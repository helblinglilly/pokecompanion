import type { paths } from '$/@types/api.js';
import { addSettingsToUrl, resolveSettings } from '$/lib/api/settings.js';
import { PUBLIC_API_HOST } from '$env/static/public';

export async function load({ fetch, params, url, parent }) {
  const { settings: serverSettings } = await parent();
  const settings = resolveSettings(serverSettings);

  const pokedexRequestUrl = addSettingsToUrl(
    new URL(`${PUBLIC_API_HOST}/pokedex/${params.pokedexid}`),
    settings,
    url.searchParams
  )

  const page = url.searchParams.get('page');
  if (page) {
    pokedexRequestUrl.searchParams.set('page', page)
  }

  const pageSize = url.searchParams.get('pageSize');
  if (pageSize) {
    pokedexRequestUrl.searchParams.set('pageSize', pageSize)
  };

  const jumpTo = url.searchParams.get('jumpTo');
  if (jumpTo) {
    pokedexRequestUrl.searchParams.set('jumpTo', jumpTo);
  }

  const res = await fetch(pokedexRequestUrl);
  const pokedex = (await res.json()) as paths['/pokedex/{pokedexId}']['get']['responses']['200']['content']['application/json']

  return {
    pokedex
  };
}
