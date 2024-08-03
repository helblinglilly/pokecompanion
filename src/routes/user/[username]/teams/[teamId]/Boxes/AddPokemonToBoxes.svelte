<script lang="ts">
	import {
		getGameGroupFromGame,
		getPokemonEntry,
		type IStaticPokemon,
		type PokeapiVersionNames
	} from '$/lib/data/games';
	import { primaryLanguage, secondaryLanguage } from '$/lib/stores/domain';
	import { getMultiLanguageName } from '$/lib/utils/language';
	import Button from '$/ui/atoms/button';
	import Card from '$/ui/atoms/card/Card.svelte';
	import Sprite from '$/ui/atoms/pokemon/sprite';
	import Modal from '$/ui/molecules/Modal/Modal.svelte';

	export let teamId: string;
	export let game: PokeapiVersionNames;

	let showOverlay = false;
	let nickname: string;
	let id: number;
	let variety: string;
	let ability: number;
	let moves: { id: number }[] = [];
	let heldItem: number;
	let gender: 'female' | 'male' | undefined;
	let shiny: boolean = false;
	let pokemonResults: IStaticPokemon[] = [];

	let timer: any;
	const pokemonSearch = (target: EventTarget | null) => {
		clearTimeout(timer);
		timer = setTimeout(async () => {
			if (!target) {
				return;
			}
			// @ts-ignore
			const searchTerm = target.value;

			if (!searchTerm) {
				return;
			}

			const res = await fetch(`/api/search/pokemon?game=${game}&term=${searchTerm}`);
			const body = (await res.json()) as Promise<any>;

			// @ts-ignore
			pokemonResults = body.data.pokemon;
		}, 750);
	};
</script>

<Button
	classes="h-2 text-sm min-h-[4rem] md:min-h-fit"
	variant="accent"
	on:click={() => {
		showOverlay = true;
	}}
>
	Add Pokémon
</Button>

<Modal bind:showModal={showOverlay} classes="md:w-[40rem] h-full">
	<h2 class="h2" slot="header">Add Pokémon to team</h2>

	<div class="columns gap-4">
		<div class="column">
			<p>Do you want to give it a nickname?</p>
			<input type="text" placeholder="Nickname" class="w-full" bind:value={nickname} />
		</div>

		<div class="column">
			<p>Find Pokémon</p>

			<input
				type="text"
				placeholder="Search term"
				class="w-full"
				on:keyup={({ target }) => pokemonSearch(target)}
			/>
		</div>
	</div>

	<div class="mt-4 gap-2 grid min-h-[300px]">
		{#if pokemonResults.length === 0}
			<p>No results</p>
		{/if}
		{#each pokemonResults.filter((a) => a.inGame) as result}
			<Card
				classes="inline-flex space-between gap-4"
				isClickable
				style="height: 8rem;"
				on:click={() => {
					console.log('selected', result.id);
				}}
			>
				<Sprite
					id={result.id}
					gameOverride={getGameGroupFromGame({ pokeapi: game, shortName: '' })}
					style="height: auto; width: 96px;"
				/>
				<p style="margin-top: auto; margin-bottom: auto;">
					#{result.id}
					{getMultiLanguageName(
						getPokemonEntry(result.id).names,
						$primaryLanguage,
						$secondaryLanguage
					)}
				</p>
			</Card>
		{/each}
	</div>
</Modal>
