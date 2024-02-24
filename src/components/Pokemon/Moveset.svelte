<script lang="ts">
	import type { IMoves } from '$lib/data/movesetFilter';
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
</script>

<div class="container">
	{#if relevantMoves}
		{#if relevantMoves.levelupMoves.length > 0}
			<div class="item">
				<h4 class="h4">Level up</h4>
				{#each relevantMoves.levelupMoves.sort((a, b) => {
					return a.level > b.level ? 1 : -1;
				}) as levelMove}
					<Move url={levelMove.move.url} level={levelMove.level} />
				{/each}
			</div>
		{/if}

		{#if relevantMoves.tmMoves.length > 0}
			<div class="item">
				<h4 class="h4">TM / HM</h4>
				{#each relevantMoves.tmMoves.sort((a, b) => {
					return a.move.name > b.move.name ? 1 : -1;
				}) as tmMove}
					<Move url={tmMove.move.url} />
				{/each}
			</div>
		{/if}

		{#if relevantMoves.breedMoves.length > 0}
			<div class="item">
				<h4 class="h4">Breeding</h4>
				{#each relevantMoves.breedMoves.sort((a, b) => {
					return a.move.name > b.move.name ? 1 : -1;
				}) as breedMove}
					<Move url={breedMove.move.url} />
				{/each}
			</div>
		{/if}

		{#if relevantMoves.tutorMoves.length > 0}
			<div class="item">
				<h4 class="h4">Tutored</h4>
				{#each relevantMoves.tutorMoves.sort((a, b) => {
					return a.move.name > b.move.name ? 1 : -1;
				}) as tutorMove}
					<Move url={tutorMove.move.url} />
				{/each}
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
