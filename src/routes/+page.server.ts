import { fetchPokemonPreview } from '$/lib/api/fetch';
import { daysPassedInYear, randomDailyNumber } from '$/lib/utils/number';

export async function load({ cookies, depends }) {
	depends('selectedGame');
	const id = randomDailyNumber(1025)[daysPassedInYear()] ?? 1;

	const versionSpecificSprites = cookies.get('versionSpecificPokemonSprites') === 'true';
	const game = cookies.get('selectedGame');

	const pokemon = await fetchPokemonPreview({
		id,
		shiny: Math.random() < 0.04,
		sprites: {
			game,
			versionSpecificPokemonSprites: versionSpecificSprites
		}
	});

	return {
		pokemon
	};
}
