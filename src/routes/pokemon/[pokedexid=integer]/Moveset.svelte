<script lang="ts">
	import Button from '$/ui/atoms/button/Button.svelte';
	import { Logger } from '$lib/log';
	import Move from './Move.svelte';
	import type { paths } from '$/@types/api';

	export let completeData: paths['/pokemon/v1/{id}']['get']['responses']['200']['content']['application/json']['moves']['black-2-white-2'];

	$: showLevelMovesOnMobile = false;
	$: showTmMovesOnMobile = false;
	$: showBreedMovesOnMobile = false;
	$: showTutoredMovesOnMobile = false;
</script>

<div class="container pt-2">
	{#if completeData}
		{#if completeData.levelup.length > 0}
			<section class="item">
				<h4 class="h4">Level up</h4>
				<div class="md:hidden">
					<Button
						variant="primary"
						style="height: 3rem; margin-bottom: 1rem;"
						classes="w-full "
						on:click={() => {
							showLevelMovesOnMobile = !showLevelMovesOnMobile;
						}}
						data-umami-event="PokemonMoveList"
						>{showLevelMovesOnMobile ? 'Hide' : 'Show'}
						{completeData.levelup.length} moves</Button
					>
				</div>

				<div class={`grid gap-4 ${!showLevelMovesOnMobile ? 'mobile-hidden' : 'grid'}`}>
					{#each completeData.levelup.sort((a, b) => {
						return (a.level || -1) > (b.level || -1) ? 1 : -1;
					}) as levelMove}
						<Move move={levelMove} />
					{/each}
				</div>
			</section>
		{/if}

		{#if completeData.tm.length > 0}
			<div class="item">
				<h4 class="h4">TM/TR/HM</h4>
				<div class="md:hidden">
					<Button
						variant="primary"
						style="height: 3rem; margin-bottom: 1rem;"
						classes="w-full"
						on:click={() => {
							showTmMovesOnMobile = !showTmMovesOnMobile;
							Logger.addPageAction('UIInteraction', 'PokemonMoveList', {
								action: showTmMovesOnMobile ? 'Hide' : 'Show',
								context: 'TMMoves'
							});
						}}>{showTmMovesOnMobile ? 'Hide' : 'Show'} {completeData.tm.length} moves</Button
					>
				</div>

				<div class={`grid gap-4 ${!showTmMovesOnMobile ? 'mobile-hidden' : 'grid'}`}>
					{#each completeData.tm.sort((a, b) => {
						return a.id > b.id ? 1 : -1;
					}) as tmMove}
						<Move move={tmMove} />
					{/each}
				</div>
			</div>
		{/if}

		{#if completeData.breed.length > 0}
			<div class="item">
				<h4 class="h4">Breeding</h4>

				<div class="md:hidden">
					<Button
						variant="primary"
						style="height: 3rem; margin-bottom: 1rem;"
						classes="w-full"
						on:click={() => {
							showBreedMovesOnMobile = !showBreedMovesOnMobile;
							Logger.addPageAction('UIInteraction', 'PokemonMoveList', {
								action: showBreedMovesOnMobile ? 'Hide' : 'Show',
								context: 'BreedMoves'
							});
						}}
						>{showBreedMovesOnMobile ? 'Hide' : 'Show'}
						{completeData.breed.length} moves</Button
					>
				</div>

				<span class={`grid gap-4 ${!showBreedMovesOnMobile ? 'mobile-hidden' : 'grid'}`}>
					{#each completeData.breed.sort((a, b) => {
						return a.id > b.id ? 1 : -1;
					}) as breedMove}
						<Move move={breedMove} />
					{/each}
				</span>
			</div>
		{/if}

		{#if completeData.tutor.length > 0}
			<div class="item">
				<h4 class="h4">Tutored</h4>

				<div class="md:hidden">
					<Button
						variant="primary"
						style="height: 3rem; margin-bottom: 1rem;"
						classes="w-full"
						on:click={() => {
							showTutoredMovesOnMobile = !showTutoredMovesOnMobile;
							Logger.addPageAction('UIInteraction', 'PokemonMoveList', {
								action: showTutoredMovesOnMobile ? 'Hide' : 'Show',
								context: 'TutorMoves'
							});
						}}
						>{showTutoredMovesOnMobile ? 'Hide' : 'Show'}
						{completeData.tutor.length} moves</Button
					>
				</div>

				<span class={`grid gap-4 ${!showTutoredMovesOnMobile ? 'mobile-hidden' : 'grid'}`}>
					{#each completeData.tutor.sort((a, b) => {
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

		.mobile-hidden {
			display: none !important;
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
