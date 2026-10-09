import type { components } from '$/@types/api';

/**
 * Returns whether a Pokémon image is pixel art and should use nearest-neighbour rendering.
 *
 * Generation VI introduced anti-aliased, non-pixel sprites. Default to smooth rendering when
 * the game is unknown too: during SSR the selected game has not been initialised yet, and
 * pixelating a modern asset is much more visibly harmful than smoothing an older one briefly.
 */
export function isSprite(game: components['schemas']['PokeapiVersionGroups'] | undefined) {
	const pixelArtGames: components['schemas']['PokeapiVersionGroups'][] = [
		'red-blue',
		'yellow',
		'gold-silver',
		'crystal',
		'ruby-sapphire',
		'emerald',
		'firered-leafgreen',
		'diamond-pearl',
		'platinum',
		'heartgold-soulsilver',
		'black-white',
		'black-2-white-2'
	];

	return game !== undefined && pixelArtGames.includes(game);
}
