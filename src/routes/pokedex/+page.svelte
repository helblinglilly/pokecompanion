<script lang="ts">
	import { type components } from '$/@types/api';
	import SocialPreview from '$/lib/components/SocialPreview.svelte';
	import { selectedGame } from '$/lib/stores/domain';
	import Card from '$/ui/atoms/Card.svelte';

	let { data } = $props();
	const dexData = $derived(
		Object.values(data.pokedexes).sort((a, b) => {
			const aOrder = a.game.games[0]?.globalSortOrder ?? 1;
			const bOrder = b.game.games[0]?.globalSortOrder ?? Number.MAX_SAFE_INTEGER;

			return aOrder < bOrder ? 1 : -1;
		})
	);

	const selectedGameDex = $derived(
		$selectedGame?.pokeapi ? data.pokedexes[$selectedGame.pokeapi] : null
	);
</script>

{#snippet pokedexGrid(
	pokedexList: (typeof dexData)[number]['pokedex'],
	game: components['schemas']['IGameGroup']
)}
	<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each pokedexList as pokedex}
			<a id={pokedex.slug} href={pokedex.slug + `?game=${game.pokeapi}`} class="no-underline">
				<Card
					ariaLabel={pokedex.name}
					classes="m-0 w-full grid justify-between h-fit min-h-20"
					isClickable
				>
					<h4 class="h4">{pokedex.name}</h4>
					<p>{pokedex.description}</p>
				</Card>
			</a>
		{/each}
	</div>
{/snippet}

<SocialPreview
	title="All Pokédexes"
	description="List of all Pokédexes in the main-series games."
	previewImage="https://socialpreviews.pokecompanion.helbling.uk/generic.png"
/>

<h1 class="h1">Pokédex</h1>

<div class="grid gap-4">
	{#if selectedGameDex}
		<h3 class="h3">{selectedGameDex.game.shortName}</h3>
		{@render pokedexGrid(selectedGameDex.pokedex, selectedGameDex.game)}
		<hr />
	{/if}

	{#each Object.entries(dexData) as [_, dexGameEntry]}
		<h3 class="h3" id={dexGameEntry.game.pokeapi}>{dexGameEntry.game.shortName}</h3>

		{@render pokedexGrid(dexGameEntry.pokedex, dexGameEntry.game)}
	{/each}
</div>
