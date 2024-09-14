<script lang="ts">
	import type { IGameGroups } from '$/lib/data/games';
	import type { IBasePokemon } from '$/lib/types/ITeams';
	import Card from '$/ui/atoms/card/Card.svelte';
	import Sprite from '$/ui/atoms/pokemon/sprite';
	import type { Writable } from 'svelte/store';
	import { getPokemonEntry } from '$/lib/data/games';
	import { getMultiLanguageName } from '$/lib/utils/language';
	import { primaryLanguage, secondaryLanguage } from '$/lib/stores/domain';
	import PokemonMoves from '../PokemonMoves.svelte';

	export let pokemon: Writable<IBasePokemon>;
	export let game: IGameGroups | undefined;
</script>

<h2 class="h2">Confirm Pokémon</h2>

<div class="grid md:flex m-4 gap-4">
	<Card classes="grid justify-center">
		<Sprite
			{...pokemon}
			female={$pokemon.gender === 'female'}
			id={$pokemon.national_dex}
			gameOverride={game}
			style="width: 10rem;"
		/></Card
	>

	<Card classes="w-full">
		<h2 class="h2">
			{$pokemon.nickname && $pokemon.nickname.length > 0
				? $pokemon.nickname
				: getMultiLanguageName(
						getPokemonEntry($pokemon.national_dex).names,
						$primaryLanguage,
						$secondaryLanguage
				  )}
		</h2>

		<h3 class="h3">Moves</h3>
		<PokemonMoves pokemon={$pokemon} {game} />
	</Card>
</div>
