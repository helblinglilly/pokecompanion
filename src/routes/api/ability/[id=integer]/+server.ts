import { GameGroups, getGameGroupFromName } from '$/lib/data/games.js';
import { Logger } from '$/lib/log.js';
import { parseUserPreferences, respondWithJson } from '$/routes/api/helpers';
import type { AbilityResponse, PokeapiAbility } from './types.js';

export async function GET({ request, platform, cookies, params }) {
	const url = new URL(request.url);

	const userPreferences = parseUserPreferences(url, cookies);

	const apiRes = await fetch(`https://pokeapi.co/api/v2/ability/${params.id}`);
	if (!apiRes.ok) {
		platform?.context.waitUntil(
			Logger.error(
				Logger.ErrorClasses.ExternalAPIRequestFailed,
				new Error(`Pokeapi returned with status ${apiRes.status}`),
				{
					context: `Ability ${params.id}`
				}
			)
		);
		return new Response('API Error', { status: apiRes.status });
	}

	const body = (await apiRes.json()) as PokeapiAbility;

	const effect_entries = body.effect_entries;

	if (userPreferences.selectedGame) {
		body.effect_changes.forEach((change) => {
			const changeGame = getGameGroupFromName(change.version_group.name);
			const changeGameIndex = GameGroups.findIndex(
				(group) => group.pokeapi === changeGame?.pokeapi
			);

			const selectedGameIndex = GameGroups.findIndex(
				(group) => group.pokeapi === userPreferences.selectedGame?.pokeapi
			);

			change.effect_entries.forEach((entry) => {
				console.log(entry);
				const toReplaceIndex = effect_entries.findIndex(
					(entry) => entry.language.name === entry.language.name
				);
				if (changeGameIndex > -1 && selectedGameIndex > -1 && toReplaceIndex > -1) {
					console.log(changeGameIndex, selectedGameIndex, toReplaceIndex);
					if (changeGameIndex <= selectedGameIndex && effect_entries[toReplaceIndex]) {
						effect_entries[toReplaceIndex].effect = entry.effect;
					}
				}
			});
		});
	}

	const responseBody: AbilityResponse = {
		effect_entries,
		flavor_text_entries: body.flavor_text_entries,
		generation: body.generation,
		id: body.id,
		is_main_series: body.is_main_series,
		name: body.name,
		names: body.names,
		pokemon: body.pokemon
	};

	return respondWithJson(responseBody, 200, true);
}
