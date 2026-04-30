import type { components } from "$/@types/api";

/**
 * Returns a boolean to weather a presumed to be sprite should
 * be pixelated or not.
 *
 * Should only be used with Pokemon
 */
export function isSprite(game: components["schemas"]["PokeapiVersionGroups"] | undefined) {
  const blackList: components["schemas"]["PokeapiVersionGroups"][] = [
    'x-y',
    'omega-ruby-alpha-sapphire',
    'sun-moon',
    'ultra-sun-ultra-moon',
    'lets-go-pikachu-lets-go-eevee',
    'sword-shield',
    'brilliant-diamond-shining-pearl',
    'legends-arceus',
    'scarlet-violet',
    'legends-za'

  ]

  if (!game) {
    return true;
  }

  return !blackList.includes(game)
}
