<script lang="ts">
	import { type IGameGroups } from '$/lib/data/games';
	import { primaryLanguage, secondaryLanguage } from '$/lib/stores/domain';
	import type { IBasePokemon } from '$/lib/types/ITeams';
	import { getNameEntry } from '$/lib/utils/language';
	import { termNormaliser } from '$/lib/utils/string';
	import type { IPokemonMinimalMove } from '$/routes/api/pokemon/types';
	import Card from '$/ui/atoms/card/Card.svelte';
	import MoveListEntry from '$/ui/molecules/move/list/MoveListEntry.svelte';
	import { onMount } from 'svelte';
	import { derived, writable, type Writable } from 'svelte/store';

	export let pokemon: Writable<IBasePokemon>;
	export let game: IGameGroups | undefined;

	interface IMoves {
		levelupMoves: IPokemonMinimalMove[];
		tmMoves: IPokemonMinimalMove[];
		breedMoves: IPokemonMinimalMove[];
		tutorMoves: IPokemonMinimalMove[];
	}

	const allResults: Writable<IMoves> = writable({
		tutorMoves: [],
		tmMoves: [],
		levelupMoves: [],
		breedMoves: []
	});

	const filterTerm: Writable<string | undefined> = writable(undefined);

	const filteredMoves = derived([allResults, filterTerm, pokemon], ([allMoves, term]) => {
		function containsFilterTerm(move: IPokemonMinimalMove) {
			const lang1 = termNormaliser(getNameEntry(move.names, $primaryLanguage) ?? '');
			const lang2 = termNormaliser(getNameEntry(move.names, $secondaryLanguage) ?? '');
			const normalisedTerm = termNormaliser(term ?? '');

			if (!normalisedTerm || normalisedTerm.length === 0) {
				return true;
			}

			if (lang1 && !lang2) {
				return lang1.includes(normalisedTerm);
			} else if (lang2 && !lang1) {
				return lang2.includes(normalisedTerm);
			} else if (lang1 && lang2) {
				return lang1.includes(normalisedTerm) || lang2.includes(normalisedTerm);
			}
			return false;
		}

		const nonSelectedMoves = filterSelectedMoves(allMoves);

		return {
			tmMoves: nonSelectedMoves.tmMoves.filter((a) => containsFilterTerm(a)),
			tutorMoves: nonSelectedMoves.tutorMoves.filter((a) => containsFilterTerm(a)),
			levelupMoves: nonSelectedMoves.levelupMoves.filter((a) => containsFilterTerm(a)),
			breedMoves: nonSelectedMoves.breedMoves.filter((a) => containsFilterTerm(a))
		};
	});

	onMount(async () => {
		const res = await fetch(`/api/pokemon/${$pokemon.national_dex}/moves?game=${game?.pokeapi}`);
		const body = (await res.json()) as unknown as IMoves;

		allResults.set(body);
	});

	let currentlySelecting = $pokemon.move1
		? 1
		: $pokemon.move2
		? 2
		: $pokemon.move3
		? 3
		: $pokemon.move4
		? 4
		: 1;

	function filterSelectedMoves(allMoves: IMoves) {
		return {
			tmMoves: allMoves.tmMoves.filter(
				(a) => ![$pokemon.move1, $pokemon.move2, $pokemon.move3, $pokemon.move4].includes(a.id)
			),
			breedMoves: allMoves.breedMoves.filter(
				(a) => ![$pokemon.move1, $pokemon.move2, $pokemon.move3, $pokemon.move4].includes(a.id)
			),
			levelupMoves: allMoves.levelupMoves.filter(
				(a) => ![$pokemon.move1, $pokemon.move2, $pokemon.move3, $pokemon.move4].includes(a.id)
			),
			tutorMoves: allMoves.tutorMoves.filter(
				(a) => ![$pokemon.move1, $pokemon.move2, $pokemon.move3, $pokemon.move4].includes(a.id)
			)
		};
	}

	function selectMove(moveId: number) {
		if (currentlySelecting === 1) {
			$pokemon.move1 = moveId;
		} else if (currentlySelecting === 2) {
			$pokemon.move2 = moveId;
		} else if (currentlySelecting === 3) {
			$pokemon.move3 = moveId;
		} else if (currentlySelecting === 4) {
			$pokemon.move4 = moveId;
		}

		if (currentlySelecting !== 4) {
			currentlySelecting++;
		}
		filterTerm.set(undefined);
	}
</script>

<div class="grid gap-4 mt-2">
	<div class="grid md:grid-cols-2 gap-4">
		{#if $pokemon.move1}
			<MoveListEntry
				id={$pokemon.move1}
				game={game?.pokeapi}
				style={`padding: 1rem; ${
					currentlySelecting === 1 ? 'background-color: var(--card-hover);' : ''
				}`}
				on:click={() => {
					if (currentlySelecting === 1) {
						return;
					} else {
						currentlySelecting = 1;
					}
				}}
			/>
		{:else}
			<Card
				isActive={currentlySelecting === 1}
				isClickable={currentlySelecting !== 1}
				classes="content-center"
				on:click={() => {
					if (currentlySelecting === 1) {
						return;
					} else {
						currentlySelecting = 1;
					}
				}}>Select Move 1</Card
			>
		{/if}

		{#if $pokemon.move2}
			<MoveListEntry
				id={$pokemon.move2}
				game={game?.pokeapi}
				style={`padding: 1rem; ${
					currentlySelecting === 2 ? 'background-color: var(--card-hover);' : ''
				}`}
				on:click={() => {
					if (currentlySelecting === 2) {
						return;
					} else {
						currentlySelecting = 2;
					}
				}}
			/>
		{:else}
			<Card
				isActive={currentlySelecting === 2}
				isClickable={currentlySelecting !== 2}
				classes="content-center"
				on:click={() => {
					if (currentlySelecting === 2) {
						return;
					} else {
						currentlySelecting = 2;
					}
				}}>Select Move 2</Card
			>
		{/if}

		{#if $pokemon.move3}
			<MoveListEntry
				game={game?.pokeapi}
				id={$pokemon.move3}
				style={`padding: 1rem; ${
					currentlySelecting === 3 ? 'background-color: var(--card-hover);' : ''
				}`}
				on:click={() => {
					if (currentlySelecting === 3) {
						return;
					} else {
						currentlySelecting = 3;
					}
				}}
			/>
		{:else}
			<Card
				classes="content-center"
				isActive={currentlySelecting === 3}
				isClickable={currentlySelecting !== 3}
				on:click={() => {
					if (currentlySelecting === 3) {
						return;
					} else {
						currentlySelecting = 3;
					}
				}}>Select Move 3</Card
			>
		{/if}

		{#if $pokemon.move4}
			<MoveListEntry
				game={game?.pokeapi}
				id={$pokemon.move4}
				style={`padding: 1rem; ${
					currentlySelecting === 4 ? 'background-color: var(--card-hover);' : ''
				}`}
				on:click={() => {
					if (currentlySelecting === 4) {
						return;
					} else {
						currentlySelecting = 4;
					}
				}}
			/>
		{:else}
			<Card
				classes="content-center"
				isActive={currentlySelecting === 4}
				isClickable={currentlySelecting !== 4}
				on:click={() => {
					if (currentlySelecting === 4) {
						return;
					} else {
						currentlySelecting = 4;
					}
				}}>Select Move 4</Card
			>
		{/if}
	</div>

	<h2 class="h2">All Moves</h2>
	<input type="text" placeholder="Filter moves" bind:value={$filterTerm} />

	{#if $filteredMoves.levelupMoves.length > 0}
		<h3 class="h3">Level up</h3>
	{/if}
	<div class="grid md:grid-cols-2 gap-4">
		{#each $filteredMoves.levelupMoves as move}
			<MoveListEntry
				game={game?.pokeapi}
				style="padding: 1rem;"
				id={move.id}
				on:click={({ detail }) => {
					selectMove(detail.id);
				}}
			/>
		{/each}
	</div>

	{#if $filteredMoves.tmMoves.length > 0}
		<h3 class="h3">TM/TR/HM</h3>
	{/if}
	<div class="grid md:grid-cols-2 gap-4">
		{#each $filteredMoves.tmMoves as move}
			<MoveListEntry
				game={game?.pokeapi}
				style="padding: 1rem;"
				id={move.id}
				on:click={({ detail }) => {
					selectMove(detail.id);
				}}
			/>
		{/each}
	</div>

	{#if $filteredMoves.breedMoves.length > 0}
		<h3 class="h3">Breeding</h3>
	{/if}
	<div class="grid md:grid-cols-2 gap-4">
		{#each $filteredMoves.breedMoves as move}
			<MoveListEntry
				game={game?.pokeapi}
				style="padding: 1rem;"
				id={move.id}
				on:click={({ detail }) => {
					selectMove(detail.id);
				}}
			/>
		{/each}
	</div>

	{#if $filteredMoves.tutorMoves.length > 0}
		<h3 class="h3">Tutor</h3>
	{/if}
	<div class="grid md:grid-cols-2 gap-4">
		{#each $filteredMoves.tutorMoves as move}
			<MoveListEntry
				game={game?.pokeapi}
				style="padding: 1rem;"
				id={move.id}
				on:click={({ detail }) => {
					selectMove(detail.id);
				}}
			/>
		{/each}
	</div>
</div>
