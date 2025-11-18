import type { Languages } from '$/lib/utils/language';
import PokemonNames from '$lib/data/pokemonNames.json';

const hasNameEntry = (names: Languages[] | undefined) => {
	if (!names) return false;
	return names.some(
		(name) => name.de || name.en || name.fr || name['ja-Hrkt'] || name.ja || name.ko
	);
};

const AdjustedPokemonNames = PokemonNames.sort((a, b) => {
	const aId = a.redirect ? Number(a.redirect.split('?')[0]) : a.id;
	const bId = b.redirect ? Number(b.redirect.split('?')[0]) : b.id;
	return aId > bId ? 1 : -1;
}).filter((a) => hasNameEntry(a.names as Languages[]));

export default AdjustedPokemonNames;
