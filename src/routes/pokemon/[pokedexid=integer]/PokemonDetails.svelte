<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import type { APIPokemon } from '$/@types/api.pokecompanion';
	import Card from '$/ui/atoms/Card.svelte';
	import Abilities from './Abilities.svelte';
	import BaseStats from './BaseStats.svelte';
	import Encounters from './Encounters.svelte';
	import EvolutionChain from './EvolutionChain.svelte';
	import MovesetCard from './MovesetCard.svelte';
	import PokemonCard from './PokemonCard.svelte';
	import TypeMatchup from './TypeMatchup.svelte';

	interface Props {
		pokemon: APIPokemon;
		abilities: ComponentProps<typeof Abilities>['abilities'];
		fullMoves: ComponentProps<typeof MovesetCard>['movePromise'];
		onlyShowCurrentGames?: boolean;
	}
	let { pokemon, abilities, fullMoves, onlyShowCurrentGames = false }: Props = $props();
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
	<Card classes="relative">
		<PokemonCard data={pokemon} />
	</Card>

	<Card classes="">
		<h3 class="h3 mb-4">Evolutions</h3>
		<EvolutionChain evolutions={pokemon.evolutionChain} />
	</Card>

	<Card classes="">
		<h3 class="h3 mb-4">Type matchup</h3>
		<TypeMatchup types={pokemon.types} />
	</Card>

	<Card>
		<h3 class="h3 mb-4">Base stats</h3>
		<BaseStats data={pokemon.stats} />
	</Card>

	<Card>
		<h3 class="h3">Encounters</h3>
		<Encounters encounterData={pokemon.encounters} {onlyShowCurrentGames} />
	</Card>

	<Card>
		<h3 class="h3 mb-4">Abilities</h3>
		<Abilities {abilities} />
	</Card>
</div>

<Card classes="mt-4">
	<h3 class="h3">Moveset</h3>
	<MovesetCard skeletonData={pokemon.moves} movePromise={fullMoves} {onlyShowCurrentGames} />
</Card>
