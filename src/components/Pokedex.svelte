<script lang="ts">
	import { findGameFromAPIGameName } from '$lib/data/games';
	import { primaryLanguage, secondaryLanguage } from '$lib/stores/domain';
	import type { FlavorTextEntry } from '$lib/types/IPokemon';
	import Image from './UI/Image.svelte';
	import Modal from './UI/Modal.svelte';

	let showModal = false;

	export let flavourTextEntries: FlavorTextEntry[];

	$: pokedexEntries = flavourTextEntries
		.filter((a) => a.language.name === $primaryLanguage || a.language.name === $secondaryLanguage)
		.map((a) => {
			const foundGame = findGameFromAPIGameName(a.version.name);
			return {
				language: a.language.name,
				game: foundGame ? foundGame.shortName : 'Not found',
				textEntry: a.flavor_text
			};
		})
		.sort((a) => {
			// To do: Move the selected game entry to the top
			return 1;
		});
</script>

<button
	on:click={() => {
		showModal = !showModal;
	}}
>
	Pokédex
	<Image src={'/icons/pokedex.png'} alt={'Pokédex'} style="height: 20px;" />
</button>

<Modal bind:showModal>
	<h2 slot="header">Pokédex Entries</h2>

	{#each pokedexEntries as pokedexEntry}
		<!-- Add a language flag icon? -->
		<div style="margin-top: 20px;">
			<h3 class="h3">{pokedexEntry.game}</h3>
			<p>{pokedexEntry.textEntry}</p>
		</div>
	{/each}
</Modal>

<style>
	button {
		height: 20px;
		display: inline-flex;
		align-items: center;
		min-width: fit-content;
	}

	button:hover {
		background-color: var(--accent);
	}
</style>
