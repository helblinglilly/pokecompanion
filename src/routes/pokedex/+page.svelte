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
	<div class="pokedex-grid">
		{#each pokedexList as pokedex}
			<a
				id={pokedex.slug}
				href={pokedex.slug + `?game=${game.pokeapi}`}
				class="pokedex-link no-underline"
			>
				<Card
					ariaLabel={pokedex.name}
					classes="m-0 w-full h-full grid content-start gap-2"
					isClickable
				>
					<h4 class="h4">{pokedex.name}</h4>
					{#if pokedex.description}
						<p class:badge={pokedex.description.toLowerCase() === 'dlc'}>
							{pokedex.description}
						</p>
					{/if}
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

<div class="pokedex-page">
	<header class="page-header">
		<h1 class="h1">Pokédex</h1>
	</header>

	{#if selectedGameDex}
		<section class="current-game-section" aria-labelledby="current-game-heading">
			<div class="section-heading">
				<h2 id="current-game-heading" class="h2">{selectedGameDex.game.shortName}</h2>
			</div>

			{@render pokedexGrid(selectedGameDex.pokedex, selectedGameDex.game)}
		</section>

		<hr />
	{/if}

	<section class="all-pokedexes-section" aria-labelledby="all-pokedexes-heading">
		<h2 id="all-pokedexes-heading" class="h2">All Pokédexes</h2>

		{#each dexData as dexGameEntry}
			<section class="game-section" aria-labelledby={`game-${dexGameEntry.game.pokeapi}`}>
				<h3 class="h3" id={`game-${dexGameEntry.game.pokeapi}`}>{dexGameEntry.game.shortName}</h3>

				{@render pokedexGrid(dexGameEntry.pokedex, dexGameEntry.game)}
			</section>
		{/each}
	</section>
</div>

<style>
	.pokedex-page {
		display: grid;
		gap: 2rem;
		max-width: 76rem;
	}

	.page-header,
	.current-game-section,
	.all-pokedexes-section,
	.game-section {
		display: grid;
		gap: 1rem;
	}

	.page-header {
		gap: 0.75rem;
	}

	.page-header h1,
	.current-game-section h2,
	.current-game-section p,
	.all-pokedexes-section h2,
	.game-section h3 {
		margin: 0;
	}

	.current-game-section {
		padding-left: 1rem;
		border-left: 0.35rem solid var(--red-accent);
	}

	.section-heading {
		display: grid;
		gap: 0.25rem;
	}

	.all-pokedexes-section {
		gap: 1.5rem;
	}

	.pokedex-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 23rem));
		gap: 1rem;
	}

	.pokedex-link {
		display: block;
		min-height: 5.75rem;
		border-radius: 0.5rem;
	}

	.pokedex-link:focus-visible {
		outline: 3px solid var(--red-accent);
		outline-offset: 4px;
	}

	.h4,
	.pokedex-link p {
		margin: 0;
	}

	.badge {
		width: fit-content;
		padding: 0.15rem 0.5rem;
		border-radius: 999px;
		background-color: color-mix(in srgb, var(--card-hover) 80%, var(--text) 8%);
		font-size: 0.85rem;
		font-weight: 700;
	}

	hr {
		width: 100%;
		border: 0;
		border-top: 1px solid color-mix(in srgb, var(--text) 35%, transparent);
	}
</style>
