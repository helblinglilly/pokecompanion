<script lang="ts">
	import Image from './UI/Image.svelte';
	import Modal from './UI/Modal.svelte';

	let showModal = false;

	export let pokedexEntries: { language: string; game: string; textEntry: string }[];
</script>

{#if pokedexEntries.length > 0}
	<button
		on:click={() => {
			showModal = !showModal;
		}}
	>
		Pokédex
		<Image src={'/icons/pokedex.png'} alt={'Pokédex'} style="height: 20px;" />
	</button>
{/if}

<Modal bind:showModal>
	<h2 class="h2" slot="header">Pokédex Entries</h2>

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
