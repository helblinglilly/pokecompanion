<script lang="ts">
	import { Logger } from '$lib/log';
	import Image from '$/ui/atoms/image/Image.svelte';
	import Modal from '$/ui/molecules/Modal/Modal.svelte';
	import Button from '$/ui/atoms/button/Button.svelte';

	let showModal = false;

	export let pokedexEntries: { language: string; game: string; textEntry: string }[];
	export let height: number;
	export let weight: number;
	export let cry: string | null;

	const mergedPokedexEntries = pokedexEntries;
	// .reduce((acc: { textEntry: string; games: string[]; language: string }[], currentEntry) => {
	// 	const existingEntry = acc.find(
	// 		(entry) =>
	// 			entry.textEntry === currentEntry.textEntry && entry.language === currentEntry.language
	// 	);

	// 	if (existingEntry && !existingEntry.games.includes(currentEntry.game)) {
	// 		existingEntry.games.push(currentEntry.game);
	// 	} else {
	// 		acc.push({
	// 			...currentEntry,
	// 			games: [currentEntry.game]
	// 		});
	// 	}

	// 	return acc;
	// }, [])
	// .sort((a, b) => {
	// 	// Ensure consistency in language order
	// 	return a.language < b.language ? 1 : -1;
	// });
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
		<Image src={'/icons/pokedex.png'} alt={'Pokédex'} classNames="h-5" />
	</button>
{/if}

<Modal bind:showModal classes="md:max-w-[50%]">
	<div slot="header" class="grid gap-4">
		<h2 class="h2">Pokédex Entries</h2>

		<hr style="border-color: var(--text); margin-left: -1rem;" />

		<div class="inline-flex justify-between w-full pb-4">
			<p class="mt-auto mb-auto"><strong>Height:</strong> {height / 10}m</p>
			{#if cry}
				<Button
					on:click={() => {
						const audioTrack = new Audio(cry ?? undefined);
						audioTrack.play();
					}}
				>
					Cry
				</Button>
			{/if}
			<p class="mt-auto mb-auto mr-4"><strong>Weight:</strong> {weight / 10}kg</p>
		</div>
	</div>

	{#each mergedPokedexEntries as pokedexEntry}
		<div class="pb-4">
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
