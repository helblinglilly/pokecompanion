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
const formatEvolutions = (evolution: IEvolutionChain, sourceId: number): IEvolution[] => {
	let results = evolution.evolution_details.map((details: EvolutionDetail) => {
		const targetId = Number(evolution.species.url.split('/')[6]);

		let trigger = '';
		const requirements: {
			type: string;
			info: string;
			supplementary?: string;
		}[] = [];

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
			Number(evolution.species.url.split('/')[6])
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
			requirements: [
				{
					type: 'level-up',
					info: ''
				}
			],
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

	// Checked up to 275
	return false;
};

export default formatEvolutions;
