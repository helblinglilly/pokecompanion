<script lang="ts">
	import { GameGroups } from '$lib/data/games';
	import { Logger } from '$lib/log';
	import { moveDisplayStore } from '$lib/stores/pokemonPage';
	import type { IPokemonMinimalMoveGroups } from '../../routes/api/pokemon/types';
	import Move from './Move.svelte';

	interface APIMoveData {
		[key: string]: IPokemonMinimalMoveGroups;
	}
	export let completeData: APIMoveData;

	$: showLevelMovesOnMobile = false;
	$: showTmMovesOnMobile = false;
	$: showBreedMovesOnMobile = false;
	$: showTutoredMovesOnMobile = false;

	$: relevantMoves = completeData[$moveDisplayStore.selectedGameGroup] as
		| IPokemonMinimalMoveGroups
		| undefined;
</script>

<div class="container">
	{#if !relevantMoves}
		{#if !Object.keys(completeData).includes($moveDisplayStore.selectedGameGroup)}
			<p>
				No move data for {GameGroups.filter(
					(game) => game.pokeapi === $moveDisplayStore.selectedGameGroup
				)
					.map((a) => a.shortName)
					.join(' / ')}
			</p>
		{:else}
			<p>No moves</p>
		{/if}
	{:else}
		{#if relevantMoves.levelupMoves.length > 0}
			<div class="item">
				<h4 class="h4">Level up</h4>
				<button
					class="button w-full secondary md:hidden mb-4"
					on:click={() => {
						showLevelMovesOnMobile = !showLevelMovesOnMobile;
						Logger.addPageAction('UIInteraction', 'PokemonMoveList', {
							action: showLevelMovesOnMobile ? 'Hide' : 'Show',
							context: 'LevelMoves'
						});
					}}
					>{showLevelMovesOnMobile ? 'Hide' : 'Show'}
					{relevantMoves.levelupMoves.length} moves</button
				>

				<span class={`${!showLevelMovesOnMobile ? 'hidden' : ''} md:grid`}>
					{#each relevantMoves.levelupMoves.sort((a, b) => {
						return (a.level || -1) > (b.level || -1) ? 1 : -1;
					}) as levelMove}
						<Move move={levelMove} />
					{/each}
				</span>
			</div>
		{/if}

		{#if relevantMoves.tmMoves.length > 0}
			<div class="item">
				<h4 class="h4">TM / HM</h4>
				<button
					class="button w-full secondary md:hidden mb-4"
					on:click={() => {
						showTmMovesOnMobile = !showTmMovesOnMobile;
						Logger.addPageAction('UIInteraction', 'PokemonMoveList', {
							action: showTmMovesOnMobile ? 'Hide' : 'Show',
							context: 'TMMoves'
						});
					}}>{showTmMovesOnMobile ? 'Hide' : 'Show'} {relevantMoves.tmMoves.length} moves</button
				>

				<span class={`${!showTmMovesOnMobile ? 'hidden' : ''} md:grid`}>
					{#each relevantMoves.tmMoves.sort((a, b) => {
						return a.id > b.id ? 1 : -1;
					}) as tmMove}
						<Move move={tmMove} />
					{/each}
				</span>
			</div>
		{/if}

		{#if relevantMoves.breedMoves.length > 0}
			<div class="item">
				<h4 class="h4">Breeding</h4>
				<button
					class="button w-full secondary md:hidden mb-4"
					on:click={() => {
						showBreedMovesOnMobile = !showBreedMovesOnMobile;
						Logger.addPageAction('UIInteraction', 'PokemonMoveList', {
							action: showBreedMovesOnMobile ? 'Hide' : 'Show',
							context: 'BreedMoves'
						});
					}}
					>{showBreedMovesOnMobile ? 'Hide' : 'Show'}
					{relevantMoves.breedMoves.length} moves</button
				>

				<span class={`${!showBreedMovesOnMobile ? 'hidden' : ''} md:grid`}>
					{#each relevantMoves.breedMoves.sort((a, b) => {
						return a.id > b.id ? 1 : -1;
					}) as breedMove}
						<Move move={breedMove} />
					{/each}
				</span>
			</div>
		{/if}

		{#if relevantMoves.tutorMoves.length > 0}
			<div class="item">
				<h4 class="h4">Tutored</h4>
				<button
					class="button w-full secondary md:hidden mb-4"
					on:click={() => {
						showTutoredMovesOnMobile = !showTutoredMovesOnMobile;
						Logger.addPageAction('UIInteraction', 'PokemonMoveList', {
							action: showTutoredMovesOnMobile ? 'Hide' : 'Show',
							context: 'TutorMoves'
						});
					}}
					>{showTutoredMovesOnMobile ? 'Hide' : 'Show'}
					{relevantMoves.tutorMoves.length} moves</button
				>

				<span class={`${!showTutoredMovesOnMobile ? 'hidden' : ''} md:grid`}>
					{#each relevantMoves.tutorMoves.sort((a, b) => {
						return a.id > b.id ? 1 : -1;
					}) as tutorMove}
						<Move move={tutorMove} />
					{/each}
				</span>
			</div>
		{/if}
	{/if}
</div>

<style>
	@media screen and (max-width: 768px) {
		.container {
			min-width: 100%;
			display: grid;
			grid-gap: 2rem;
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		}
	}
	@media screen and (min-width: 768px) {
		.container {
			min-width: 100%;
			display: grid;
			grid-gap: 2rem;
			grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		}
	}

	.item > h4 {
		padding-bottom: 1rem;
	}
</style>
