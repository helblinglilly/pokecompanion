import type { RequestHandler } from "@sveltejs/kit";
import { getGameGroupFromName } from "$/lib/data/games";
import type { UserPreferencePokemonVersion } from "$/lib/stores/domain";
import { getPokemonSprite } from "./internal";
import { Logger } from "$/lib/log";


async function respond(url: string, respondImage: boolean, headers: object) {
	if (respondImage){
		const response = await fetch(url);
		const blob = await response.blob();

		return new Response(blob, {
			headers: {
				'Content-Type': response.headers.get('Content-Type') || '',
				...headers
			},
		});
	}
	return new Response(url, { headers: {
		'Content-Type': 'text/plain',
		...headers
	}
	})
}

export const GET: RequestHandler = async ({ url, platform, params }) => {
  const id = Number(params.pokedex);

	const sprite = await getPokemonSprite(
		id,
		platform,
		getGameGroupFromName(url.searchParams.get('game') as UserPreferencePokemonVersion),
		url.searchParams.get('variety'),
		url.searchParams.get('shiny') === 'true',
		url.searchParams.get('gender') === 'female',
		url.searchParams.get('direction') === 'back',
		url.searchParams.get('animate') === 'true',

	)

	if (!sprite.url){
		Logger.warn('/api/pokemon/:id/sprite returned 404', {
			context: `Pokemon ${id}`,
			searchParams: url.searchParams.toString()
		})

		return new Response(null, {
			status: 404
		})
	}

	if (!sprite.isPerfectMatch){
		Logger.warn('/api/pokemon/:id/sprite failed to find a perfect match', {
			context: `Pokemon ${id}`,
			searchParams: url.searchParams.toString()
		})
	}

	const respondWithImage = url.searchParams.get('image') === 'true';
	return respond(sprite.url, respondWithImage, {
		'Cache-Control': `public, max-age=${sprite.isPerfectMatch ? 86400 : 600}, s-maxage=${sprite.isPerfectMatch ? 86400 : 600}`,
		'X-Has-Female': sprite.hasFemale,
		'X-Has-Shiny': sprite.hasShiny,
		'X-Matches-Form': sprite.matchesForm,
		'X-Is-Back': sprite.isBack,
		'X-Matches-Variety': sprite.matchesVariety,
		'X-Alt-Text': sprite.alt
	},
);
};
