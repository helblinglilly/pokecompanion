<script lang="ts">
	import type { IMoves } from '$lib/data/movesetFilter';
	import Move from './Move.svelte';

	export let allMoves: IMoves[];

	$: relevantMoves = allMoves[0];
</script>

<div class="container">
	{#if relevantMoves.levelupMoves.length > 0}
		<div class="item">
			<h4>Level up</h4>
			{#each relevantMoves.levelupMoves as levelMove}
				<Move url={levelMove.move.url} level={levelMove.level} />
			{/each}
		</div>
	{:else}
		<div class="item" />
	{/if}

	{#if relevantMoves.tmMoves.length > 0}
		<div class="item">
			<h4>TM / HM</h4>
			{#each relevantMoves.tmMoves as tmMove}
				<Move url={tmMove.move.url} />
			{/each}
		</div>
	{:else}
		<div class="item" />
	{/if}

	{#if relevantMoves.breedMoves.length > 0}
		<div class="item">
			<h4>Breeding</h4>
			{#each relevantMoves.breedMoves as breedMove}
				<Move url={breedMove.move.url} />
			{/each}
		</div>
	{:else}
		<div class="item" />
	{/if}

	{#if relevantMoves.tutorMoves.length > 0}
		<div class="item">
			<h4>Tutored</h4>
			{#each relevantMoves.tutorMoves as tutorMove}
				<Move url={tutorMove.move.url} />
			{/each}
		</div>
	{:else}
		<div class="item" />
	{/if}
</div>

<style>
	.container {
		min-width: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		grid-gap: 2rem;
	}

	.item {
	}
</style>
