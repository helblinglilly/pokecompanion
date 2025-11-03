import type { paths } from '$/@types/api';
import { PUBLIC_API_HOST } from '$env/static/public';

export async function fetchPokemonPreview({
	id,
	shiny,
	gender,
	variety,
	sprites
}: {
	id: number;
	shiny?: boolean | undefined;
	gender?: string | undefined;
	variety?: string | undefined;
	sprites?:
		| {
				versionSpecificPokemonSprites?: boolean | undefined;
				game?: string | undefined;
		  }
		| undefined;
}) {
	const url = new URL(`${PUBLIC_API_HOST}/pokemon/${id}/preview`);

	if (shiny) {
		url.searchParams.append('shiny', 'true');
	}
	if (gender) {
		url.searchParams.append('gender', gender);
	}
	if (variety) {
		url.searchParams.append('variety', variety);
	}
	if (sprites) {
		url.searchParams.append('game', `${sprites.game}`);
		url.searchParams.append('versionSpecificPokemonSprites', `true`);
	}

	const res = await fetch(url, {
		credentials: 'include'
	});

	if (res.status !== 200){
    throw new Error(`Network error - non-200 status code for ${url}`);
	}

	const body: paths['/pokemon/{id}/preview']['get']['responses']['200']['content']['application/json'] = await res.json();

  return body;
}
