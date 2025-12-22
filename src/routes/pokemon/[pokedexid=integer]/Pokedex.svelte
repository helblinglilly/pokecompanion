<script lang="ts">
	import { Logger } from '$/debt/log';
	import Image from '$/ui/atoms/Image.svelte';
	import Modal from '$/ui/molecules/Modal/Modal.svelte';
	import Button from '$/ui/atoms/Button.svelte';

	let showModal = $state(false);

	interface Props {
		pokedexEntries: { language: string; game: string; textEntry: string }[];
		height: number;
		weight: number;
		cry: string;
	}

	let { pokedexEntries, height, weight, cry }: Props = $props();

	const mergedPokedexEntries = $derived(pokedexEntries);
</script>

{#if pokedexEntries.length > 0}
	<button
		onclick={() => {
			if (!showModal) {
				Logger.addPageAction('Pokedex', {
					action: 'Overlay Shown'
				});
			}
			showModal = !showModal;
		}}
		data-umami-event="Pokedex"
	>
		Pokédex
		<Image src={'/icons/pokedex.png'} alt={'Pokédex'} classNames="h-5" />
	</button>
{/if}

<Modal bind:showModal>
	{#snippet header()}
		<div class="grid gap-4">
			<h2 class="h2">Pokédex Entries</h2>

			<hr style="border-color: var(--text); margin-left: -1rem; margin-right: -1rem;" />

			<div class="inline-flex justify-between w-full pb-4">
				<p class="mt-auto mb-auto"><strong>Height:</strong> {height / 10}m</p>
				{#if cry}
					<Button
						onclick={() => {
							const audioTrack = new Audio(cry ?? undefined);
							audioTrack.play();
						}}
					>
						Cry
					</Button>
				{/if}
				<p class="mt-auto mb-auto mr-4"><strong>Weight:</strong> {weight / 100}kg</p>
			</div>
		</div>
	{/snippet}

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
