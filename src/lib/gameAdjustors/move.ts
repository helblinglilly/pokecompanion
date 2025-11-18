import type { PokeapiVersionGroups } from '$/@types/api.pokecompanion';
import { getGameGroupFromName } from '../data/games';
import type { IMove } from '../types/IMoves';
import getLegacyDamageClass from './damageClass';

function adjustMoveForGame(move: IMove, versionGroupName: PokeapiVersionGroups | undefined) {
	const adjusted = { ...move };

	const selectedGame = getGameGroupFromName(versionGroupName);
	if (!selectedGame) {
		return adjusted;
	}

	move.past_values.forEach((pastEntry) => {
		const pastEntryGame = getGameGroupFromName(pastEntry.version_group.name);
		if (pastEntryGame) {
			if (selectedGame.generation.number < pastEntryGame.generation.number) {
				if (pastEntry.accuracy) {
					adjusted.accuracy = pastEntry.accuracy;
				}
				if (pastEntry.effect_chance) {
					adjusted.effect_chance = pastEntry.effect_chance;
				}
				if (pastEntry.effect_entries.length > 0) {
					adjusted.effect_entries = pastEntry.effect_entries;
				}
				if (pastEntry.power) {
					adjusted.power = pastEntry.power;
				}
				if (pastEntry.pp) {
					adjusted.pp = pastEntry.pp;
				}
				if (pastEntry.type) {
					adjusted.type = pastEntry.type;
				}
			}
		}
	});

	if (selectedGame.generation.number <= 3) {
		adjusted.damage_class.name = getLegacyDamageClass(
			adjusted.damage_class.name,
			adjusted.type.name
		);
	}

	return adjusted;
}

export default adjustMoveForGame;
