<script lang="ts">
	import { Logger } from '$lib/log';
	import Image from './UI/Image.svelte';
	import Modal from './UI/Modal.svelte';

	let showModal = false;

	export let pokedexEntries: { language: string; game: string; textEntry: string }[];
	export let height: number;
	export let weight: number;
	export let cry: string | null;
</script>

{#if pokedexEntries.length > 0}
	<button
		on:click={() => {
			if (!showModal) {
				Logger.addPageAction('UIInteraction', 'Pokedex', {
					action: 'Overlay Shown'
				});
			}
			showModal = !showModal;
		}}
	>
		Pokédex
		<Image src={'/icons/pokedex.png'} alt={'Pokédex'} style="height: 20px;" />
	</button>
{/if}

<Modal bind:showModal>
	<h2 class="h2" slot="header">Pokédex Entries</h2>

	<div
		class="inline-flex justify-between w-full pt-4 pb-4"
		style="border-bottom: 2px solid var(--text);"
	>
		<p class="mt-auto mb-auto"><strong>Height:</strong> {height / 10}m</p>
		{#if cry}
			<button
				class="button primary"
				on:click={() => {
					const audioTrack = new Audio(cry ?? undefined);
					audioTrack.play();
				}}>Cry</button
			>
		{/if}
		<p class="mt-auto mb-auto"><strong>Weight:</strong> {weight / 10}kg</p>
	</div>

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
