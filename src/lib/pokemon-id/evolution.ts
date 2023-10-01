import { isPokemonInGame, type IGame, getGroupName } from '$lib/data/games';
import type { EvolutionDetail, IEvolutionChain } from '$lib/types/IEvolution';

export interface IEvolution {
	sourceURL: string;
	sourceSprite: string;
	trigger: string;
	requirements: {
		type: string;
		info: string;
		supplementary?: string | undefined;
	}[];
	targetURL: string;
	targetSprite: string;
}
// Need to consider generation based evolutions - where target might not be in the target game
// Should look if specific variants evolve different and hardcode those.
// I.e Pladean Wooper to Clodsire
// Rattata to Raticate
const formatEvolutions = (
	evolution: IEvolutionChain,
	sourceId: number,
	game: IGame[] | undefined
): IEvolution[] => {
	let results = evolution.evolution_details.map((details: EvolutionDetail) => {
		const targetId = Number(evolution.species.url.split('/')[6]);

		let trigger = '';
		const requirements: {
			type: string;
			info: string;
			supplementary?: string;
		}[] = [];

		if (game) {
			const isSourceInGame = isPokemonInGame(sourceId, game[0]);
			const isTargetInGame = isPokemonInGame(targetId, game[0]);

			if (!isSourceInGame || !isTargetInGame) {
				return {
					sourceURL: `/pokemon/${sourceId}`,
					sourceSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${sourceId}.png`,
					trigger: `Not in ${getGroupName(game, ' & ', false, false, false)}`,
					requirements: requirements,
					targetURL: `/pokemon/${targetId}`,
					targetSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${targetId}.png`
				};
			}
		}

		if (details.trigger.name === 'level-up') {
			if (details.min_level) trigger = `Level ${details.min_level}`;
			else trigger = 'Level Up';
		} else if (details.trigger.name === 'use-item') {
			trigger = 'use-item';
			requirements.push({
				type: 'use-item',
				info: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${details.item.name}.png`,
				supplementary: `/item/${details.item.url.split('/')[6]}`
			});
		} else if (details.trigger.name === 'shed') {
			trigger = 'shed';
			requirements.push({
				type: 'shed',
				info: `Have at least 1 Pokéball and a free slot in your party when this Pokémon evolves`
			});
		} else if (details.trigger.name === 'three-critical-hits') {
			trigger = 'three-critical-hits';
			requirements.push({
				type: 'three-critical-hits',
				info: ''
			});
		} else {
			trigger = details.trigger.name;
		}

		if (details.gender !== null) {
			if (details.gender == '1') requirements.push({ type: 'gender', info: 'Female' });
			if (details.gender == '2') requirements.push({ type: 'gender', info: 'Male' });
		}

		if (details.held_item !== null) {
			requirements.push({
				type: 'hold-item',
				info: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${details.held_item.name}.png`,
				supplementary: `/item/${details.held_item.url.split('/')[6]}`
			});
		}

		if (details.min_happiness !== null) {
			requirements.push({
				type: 'friendship',
				info: details.min_happiness
			});
		}

		if (details.min_beauty !== null) {
			requirements.push({
				type: 'beauty',
				info: details.min_beauty
			});
		}

		if (details.needs_overworld_rain === true) {
			requirements.push({
				type: 'rain',
				info: 'Raining'
			});
		}

		if (details.time_of_day) {
			requirements.push({
				type: 'daytime',
				info: details.time_of_day
			});
		}

		if (details.trade_species) {
			requirements.push({
				type: 'trade_for',
				info: details.trade_species.name[0].toUpperCase() + details.trade_species.name.slice(1),
				supplementary: `/pokemon/${details.trade_species.url.split('/')[6]}`
			});
		}

		if (details.party_species !== null) {
			requirements.push({
				type: 'party_have',
				info: details.party_species.name[0].toUpperCase() + details.party_species.name.slice(1),
				supplementary: `/pokemon/${details.party_species.url.split('/')[6]}`
			});
		}

		if (details.party_type !== null) {
			let tidyType = details.party_type.name;
			tidyType = tidyType[0].toUpperCase() + tidyType.slice(1);
			requirements.push({
				type: 'party_type',
				info: `Party to have another ${tidyType} Pokémon`
			});
		}

		if (details.turn_upside_down) {
			requirements.push({
				type: 'other',
				info: 'Turn 3DS/Switch Upside Down'
			});
		}

		if (details.relative_physical_stats !== null) {
			if (details.relative_physical_stats === -1) {
				requirements.push({
					type: 'stats',
					info: 'Defensive > Attack'
				});
			} else if (details.relative_physical_stats === 1) {
				requirements.push({
					type: 'stats',
					info: 'Attack > Defensive'
				});
			} else if (details.relative_physical_stats === 0) {
				requirements.push({
					type: 'stats',
					info: 'Attack = Defensive'
				});
			}
		}

		if (details.known_move !== null) {
			let tidyMoveName = details.known_move.name;
			const words = tidyMoveName.split('-').map((word: string) => {
				return word[0].toUpperCase() + word.slice(1);
			});
			tidyMoveName = words.join(' ');
			requirements.push({
				type: 'know_move',
				info: `/move/${details.known_move.url.split('/')[6]}`,
				supplementary: tidyMoveName
			});
		}

		if (details.known_move_type !== null) {
			requirements.push({
				type: 'know_move_type',
				info: details.known_move_type.name[0].toUpperCase() + details.known_move_type.name.slice(1)
			});
		}

		if (details.min_affection !== null) {
			requirements.push({
				type: 'affection',
				info: details.min_affection
			});
		}

		if (details.location !== null) {
			let tidyLocation = details.location.name;
			const words = tidyLocation.split('-').map((word: string) => {
				return word[0].toUpperCase() + word.slice(1);
			});
			tidyLocation = words.join(' ');

			requirements.push({
				type: 'location',
				info: tidyLocation
			});
		}

		const weirdResults = processWeirdEvolutions(details, sourceId, targetId);
		if (weirdResults) {
			return weirdResults;
		}

		const result = {
			sourceURL: `/pokemon/${sourceId}`,
			sourceSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${sourceId}.png`,
			trigger: trigger,
			requirements: requirements,
			targetURL: `/pokemon/${targetId}`,
			targetSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${targetId}.png`
		};
		return result;
	});

	evolution.evolves_to.forEach((nestedEvolution) => {
		const nestedResult = formatEvolutions(
			nestedEvolution,
			Number(evolution.species.url.split('/')[6]),
			game
		);
		results = results.concat(nestedResult);
	});
	return results;
};

const processWeirdEvolutions = (detail: EvolutionDetail, sourceId: number, targetId: number) => {
	const yanmaskRunerigusIds = [562, 867, 563];
	if (yanmaskRunerigusIds.includes(sourceId) || yanmaskRunerigusIds.includes(targetId)) {
		return {
			sourceURL: `/pokemon/562`,
			sourceSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/562.png`,
			trigger: 'other',
			requirements: [
				{
					type: 'other',
					info: 'Go through the Stone Gate in the Dusty Bowl after Yamask has lost more than 49 HP from one attack and did not faint in that battle - or since'
				}
			],
			targetURL: `/pokemon/867`,
			targetSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/867.png`
		};
	}

	// Paldean Wooper to Clodsire
	if (sourceId === 194 && targetId === 980) {
		return {
			sourceURL: `/pokemon/194?variety=wooper-paldea`,
			sourceSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10253.png`,
			trigger: 'Level 20',
			requirements: [],
			targetURL: `/pokemon/980`,
			targetSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/980.png`
		};
	}

	// Wurmple to Silcoon and Cascoon - is random
	if (sourceId === 265 && targetId === 266) {
		return {
			sourceURL: `/pokemon/265`,
			sourceSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/265.png`,
			trigger: 'Level 20',
			requirements: [
				{
					type: 'level-up',
					info: 'Random'
				}
			],
			targetURL: `/pokemon/266`,
			targetSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/266.png`
		};
	} else if (sourceId === 265 && targetId === 268) {
		return {
			sourceURL: `/pokemon/265`,
			sourceSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/265.png`,
			trigger: 'Level 20',
			requirements: [
				{
					type: 'level-up',
					info: 'Random'
				}
			],
			targetURL: `/pokemon/268`,
			targetSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/268.png`
		};
	}

	// Basulin to Basculegion
	if (sourceId === 550 && targetId === 902) {
		return {
			sourceURL: `/pokemon/550`,
			sourceSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/550.png`,
			trigger: 'recoil-damage',
			requirements: [
				{
					type: 'recoil-damage',
					info: '294'
				}
			],
			targetURL: `/pokemon/902`,
			targetSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/902.png`
		};
	}

	// Bisharp to Kingambit
	if (sourceId === 625 && targetId === 983) {
		return {
			sourceURL: `/pokemon/625`,
			sourceSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/625.png`,
			trigger: 'Level Up',
			requirements: [
				{
					type: 'battle-leader',
					info: 'Defeat 3 Bisharps surrounded by Pawniard'
				},
				{
					type: 'hold-item',
					info: "Leader's Crest",
					supplementary: '/item/2046'
				}
			],
			targetURL: `/pokemon/983`,
			targetSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/983.png`
		};
	}

	// Rockruff to Lyanroc varieties
	if (sourceId === 744 && targetId === 745) {
		if (detail.time_of_day === 'night') {
			return {
				sourceURL: `/pokemon/744`,
				sourceSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/744.png`,
				trigger: 'Level Up',
				requirements: [
					{
						type: 'daytime',
						info: 'night'
					}
				],
				targetURL: `/pokemon/745`,
				targetSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10126.png`
			};
		} else if (detail.time_of_day === 'dusk') {
			// https://pokeapi.co/api/v2/pokemon/10152/
			return {
				sourceURL: `/pokemon/744`,
				sourceSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/744.png`,
				trigger: 'Level Up',
				requirements: [
					{
						type: 'daytime',
						info: 'dusk'
					}
				],
				targetURL: `/pokemon/745`,
				targetSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10152.png`
			};
		}
	}

	// Cosmog to Sun/Moon legendaries
	if (sourceId === 790 && targetId === 791) {
		return {
			sourceURL: `/pokemon/790`,
			sourceSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/790.png`,
			trigger: 'Level 53',
			requirements: [
				{
					type: 'game-specific',
					info: 'Sun / Ultra Sun'
				}
			],
			targetURL: `/pokemon/791`,
			targetSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/791.png`
		};
	} else if (sourceId === 790 && targetId === 792) {
		return {
			sourceURL: `/pokemon/790`,
			sourceSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/790.png`,
			trigger: 'Level 53',
			requirements: [
				{
					type: 'game-specific',
					info: 'Moon / Ultra Moon'
				}
			],
			targetURL: `/pokemon/792`,
			targetSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/792.png`
		};
	}

	// Pawmo to Pawmot
	if (sourceId === 922 && targetId === 923) {
		return {
			sourceURL: `/pokemon/922`,
			sourceSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/922.png`,
			trigger: 'walk-r',
			requirements: [],
			targetURL: `/pokemon/923`,
			targetSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/923.png`
		};
	}

	// Tandemous to Maushold hasn't got animation
	if (sourceId === 924 && targetId === 925) {
		return {
			sourceURL: `/pokemon/924`,
			sourceSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/924.png`,
			trigger: 'Level 25',
			requirements: [
				{
					type: 'no-animation',
					info: 'No Animation'
				}
			],
			targetURL: `/pokemon/925`,
			targetSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/925.png`
		};
	}

	// Bramblin to Brambleghast
	if (sourceId === 946 && targetId === 947) {
		return {
			sourceURL: `/pokemon/946`,
			sourceSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/946.png`,
			trigger: 'walk-r',
			requirements: [],
			targetURL: `/pokemon/947`,
			targetSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/947.png`
		};
	}

	// Rellor to Rabsca
	if (sourceId === 953 && targetId === 954) {
		return {
			sourceURL: `/pokemon/953`,
			sourceSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/953.png`,
			trigger: 'walk-r',
			requirements: [],
			targetURL: `/pokemon/954`,
			targetSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/954.png`
		};
	}

	// Finizen to Palafin
	if (sourceId === 963 && targetId === 964) {
		return {
			sourceURL: `/pokemon/963`,
			sourceSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/963.png`,
			trigger: 'Level 38',
			requirements: [
				{
					type: 'multiplayer',
					info: 'While in multiplayer mode'
				}
			],
			targetURL: `/pokemon/964`,
			targetSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/964.png`
		};
	}

	// Mankey to Annihilape
	if (sourceId === 57 && targetId === 979) {
		return {
			sourceURL: `/pokemon/57`,
			sourceSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/57.png`,
			trigger: 'use-move',
			requirements: [
				{
					type: 'use_move',
					info: '/moves/889',
					supplementary: 'Rage Fist 20 times'
				}
			],
			targetURL: `/pokemon/979`,
			targetSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/979.png`
		};
	}

	// Gimmighoul to Gholdengo
	if (sourceId === 999 && targetId === 1000) {
		return {
			sourceURL: `/pokemon/999`,
			sourceSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/999.png`,
			trigger: 'collect-items',
			requirements: [
				{
					type: 'collect_items',
					info: '/items/1938',
					supplementary: '999 Gimmighoul coins'
				}
			],
			targetURL: `/pokemon/1000`,
			targetSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1000.png`
		};
	}

	// Checked up to 275
	return false;
};

export default formatEvolutions;
