<script lang="ts">
	import type { IGameGroups, IStaticPokemon } from '$/lib/data/games';
	import type { IBasePokemon } from '$/lib/types/ITeams';
	import PokemonListEntry from '$/ui/molecules/pokemon/list';
	import type { Writable } from 'svelte/store';

	export let pokemon: Writable<IBasePokemon>;
	export let game: IGameGroups | undefined;

	let pokemonResults: Array<IStaticPokemon & { inGame: boolean }> = [];

	let timer: any;

	const pokemonSearch = (target: EventTarget | null) => {
		clearTimeout(timer);
		timer = setTimeout(async () => {
			const currentlyActive = pokemonResults.filter((mon) => mon.id === $pokemon?.national_dex);

			if (!target) {
				pokemonResults = currentlyActive ?? [];
				return;
			}
			// @ts-ignore
			const searchTerm = target.value;

			if (!searchTerm) {
				pokemonResults = currentlyActive ?? [];
				return;
			}

			const res = await fetch(`/api/search/pokemon?game=${game?.pokeapi}&term=${searchTerm}`);
			const body = (await res.json()) as Promise<any>;

			// @ts-ignore
			pokemonResults = body.data.pokemon;
		}, 750);
	};
</script>

<div class="columns gap-4">
	<div class="column">
		<p>Do you want to give it a nickname?</p>
		<input type="text" placeholder="Nickname" class="w-full" bind:value={$pokemon.nickname} />
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

<div class="mt-4 min-h-[60vh]">
	{#if pokemonResults.length === 0}
		<p>No results</p>
	{/if}
	{#each pokemonResults.filter((a) => a.inGame) as result}
		<div class="mb-2">
			<PokemonListEntry
				pokemon={{
					id: result.id,
					shiny: false
				}}
				gameOverride={game}
				on:click={({ detail }) => {
					$pokemon.national_dex = detail.id;
				}}
				cardActiveState={$pokemon.national_dex === result.id}
			/>
		</div>
	{/each}
</div>
