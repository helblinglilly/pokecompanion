<script lang="ts">
	import type { IMoves } from '$lib/data/movesetFilter';
	import { Logger } from '$lib/log';
	import { encounterDisplayStore } from '$lib/stores/pokemonPage';
	import Move from './Move.svelte';

	export let allMoves: IMoves[];

	$: relevantMoves = allMoves.find((moveset) => {
		if ($encounterDisplayStore && $encounterDisplayStore.selectedGameGroup) {
			return (
				moveset.versionGroup === $encounterDisplayStore?.selectedGameGroup[0].pokeapiVersionGroup
			);
		}
		return true;
	});

	$: showLevelMovesOnMobile = false;
	$: showTmMovesOnMobile = false;
	$: showBreedMovesOnMobile = false;
	$: showTutoredMovesOnMobile = false;
</script>

<div class="container">
	{#if relevantMoves}
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
						return a.level > b.level ? 1 : -1;
					}) as levelMove}
						<Move url={levelMove.move.url} level={levelMove.level} />
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
						return a.move.name > b.move.name ? 1 : -1;
					}) as tmMove}
						<Move url={tmMove.move.url} />
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
						return a.move.name > b.move.name ? 1 : -1;
					}) as breedMove}
						<Move url={breedMove.move.url} />
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
						return a.move.name > b.move.name ? 1 : -1;
					}) as tutorMove}
						<Move url={tutorMove.move.url} />
					{/each}
				</span>
			</div>
		{/if}
	{:else}
		<p>No data</p>
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
