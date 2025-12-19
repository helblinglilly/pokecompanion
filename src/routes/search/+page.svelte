<script lang="ts">
	import type { paths } from '$/@types/api.js';
	import { addSettingsAsSearchParams } from '$/lib/api/clientFetch.js';
	import SocialPreview from '$/lib/components/SocialPreview.svelte';
	import { addNotification } from '$/lib/stores/notifications';
	import { searchTerm } from '$/lib/stores/searchbar.js';
	import Button from '$/ui/atoms/button';
	import Card from '$/ui/atoms/card';
	import MoveListEntry from '$/ui/molecules/move/list/MoveListEntry.svelte';
	import PokemonListEntry from '$/ui/molecules/pokemon/list/PokemonListEntry.svelte';
	import { page } from '$app/stores';
	import { PUBLIC_API_HOST } from '$env/static/public';
	import { writable } from 'svelte/store';

	export let data;
	searchTerm.set(data.searchTerm);

	const pokemonResults = writable(data.pokemon);
	const moveResults = writable(data.moves);
	const itemResults = writable(data.items);
	const abilityResults = writable(data.abilities);

	let pokemonPage = 1;
	let movesPage = 1;
	let itemsPage = 1;
	let abilityPage = 1;

	async function loadMorePokemon() {
		try {
			const url = addSettingsAsSearchParams(
				new URL(`${PUBLIC_API_HOST}/search/pokemon`),
				$page.url.searchParams
			);

			url.searchParams.append('term', $page.url.searchParams.get('term') ?? '');
			url.searchParams.append('page', `${pokemonPage + 1}`);

			const res = await fetch(url, {
				credentials: 'include'
			});

			const body =
				(await res.json()) as paths['/search/pokemon']['get']['responses']['200']['content']['application/json'];

			pokemonResults.set({
				totalItems: body.totalItems,
				data: $pokemonResults.data.concat(body.data)
			});

			pokemonPage++;
		} catch {
			addNotification({
				level: 'failure',
				message: 'Failed to fetch more Pokémon'
			});
		}
	}
	async function loadMoreMoves() {
		try {
			const url = addSettingsAsSearchParams(
				new URL(`${PUBLIC_API_HOST}/search/moves`),
				$page.url.searchParams
			);

			url.searchParams.append('term', $page.url.searchParams.get('term') ?? '');
			url.searchParams.append('page', `${movesPage + 1}`);

			const res = await fetch(url, {
				credentials: 'include'
			});

			const body =
				(await res.json()) as paths['/search/moves']['get']['responses']['200']['content']['application/json'];

			moveResults.set({
				totalItems: body.totalItems,
				data: $moveResults.data.concat(body.data)
			});

			movesPage++;
		} catch {
			addNotification({
				level: 'failure',
				message: 'Failed to fetch more moves'
			});
		}
	}
	async function loadMoreAbilities() {
		try {
			const url = addSettingsAsSearchParams(
				new URL(`${PUBLIC_API_HOST}/search/abilities`),
				$page.url.searchParams
			);

			url.searchParams.append('term', $page.url.searchParams.get('term') ?? '');
			url.searchParams.append('page', `${abilityPage + 1}`);

			const res = await fetch(url, {
				credentials: 'include'
			});

			const body =
				(await res.json()) as paths['/search/abilities']['get']['responses']['200']['content']['application/json'];

			abilityResults.set({
				totalItems: body.totalItems,
				data: $abilityResults.data.concat(body.data)
			});

			abilityPage++;
		} catch {
			addNotification({
				level: 'failure',
				message: 'Failed to fetch more items'
			});
		}
	}
	async function loadMoreItems() {
		try {
			const url = addSettingsAsSearchParams(
				new URL(`${PUBLIC_API_HOST}/search/items`),
				$page.url.searchParams
			);

			url.searchParams.append('term', $page.url.searchParams.get('term') ?? '');
			url.searchParams.append('page', `${itemsPage + 1}`);

			const res = await fetch(url, {
				credentials: 'include'
			});

			const body =
				(await res.json()) as paths['/search/items']['get']['responses']['200']['content']['application/json'];

			itemResults.set({
				totalItems: body.totalItems,
				data: $itemResults.data.concat(body.data)
			});

			itemsPage++;
		} catch {
			addNotification({
				level: 'failure',
				message: 'Failed to fetch more items'
			});
		}
	}
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<SocialPreview
	title={`${data.searchTerm} results`}
	previewImage="https://socialpreviews.pokecompanion.helbling.uk/results.png"
	description={`View results across Pokémon, Items, Moves and Abilities`}
/>

<h1 class="h1">Search results</h1>

{#if data.errorMessage}
	<p>{data.errorMessage}</p>
{/if}

<div id="searchResults" class="grid md:grid-cols-2 gap-4 pb-4">
	<section class="grid gap-4 w-full h-fit" aria-label="Pokemon results">
		<h2 class="h2" id="pokemon">Pokémon</h2>
		{#if data.pokemon.data.length === 0}
			<p>No results</p>
		{/if}

		{#each $pokemonResults.data as pokemon}
			<a href={pokemon.slug}>
				<PokemonListEntry {pokemon} shiny={false} gender={undefined} showGenderAndShiny={false} />
			</a>
		{/each}

		{#if $pokemonResults.data.length < $pokemonResults.totalItems}
			<Button
				on:click={() => {
					loadMorePokemon();
				}}
			>
				Show {Math.min(10, $pokemonResults.totalItems - $pokemonResults.data.length)} more Pokémon ({$pokemonResults
					.data.length}/{$pokemonResults.totalItems})
			</Button>
		{/if}
	</section>

	<section class="grid gap-4 w-full h-fit" aria-label="Move results">
		<h2 class="h2" id="moves">Moves</h2>
		{#if data.moves.totalItems === 0}
			<p>No results</p>
		{/if}

		{#each $moveResults.data as move}
			<a href={move.slug}>
				<MoveListEntry {move} />
			</a>
		{/each}

		{#if $moveResults.data.length < $moveResults.totalItems}
			<Button
				on:click={() => {
					loadMoreMoves();
				}}
			>
				Show {Math.min(10, $moveResults.totalItems - $moveResults.data.length)} more moves ({$moveResults
					.data.length}/{$moveResults.totalItems})
			</Button>
		{/if}
	</section>

	<section class="grid gap-4 w-full h-fit" aria-label="Item results">
		<h2 class="h2" id="moves">Items</h2>
		{#if data.items.totalItems === 0}
			<p>No results</p>
		{/if}

		{#each $itemResults.data as item}
			<a href={item.slug}>
				<Card
					id={`item-${item.id}`}
					style={`position: relative;`}
					classes={`m-0 w-full flex p-8 h-28`}
					isClickable
				>
					<p class="content-center">{item.name}</p>
				</Card>
			</a>
		{/each}

		{#if $itemResults.data.length < $itemResults.totalItems}
			<Button
				on:click={() => {
					loadMoreItems();
				}}
			>
				Show {Math.min(10, $itemResults.totalItems - $itemResults.data.length)} more items ({$itemResults
					.data.length}/{$itemResults.totalItems})
			</Button>
		{/if}
	</section>

	<section class="grid gap-4 w-full h-fit" aria-label="Ability results">
		<h2 class="h2" id="moves">Abilities</h2>
		{#if data.abilities.totalItems === 0}
			<p>No results</p>
		{/if}

		{#each $abilityResults.data as ability}
			<a href={ability.slug}>
				<Card
					id={`item-${ability.id}`}
					style={`position: relative;`}
					classes={`m-0 w-full flex p-8 h-28`}
					isClickable
				>
					<p class="content-center">{ability.name}</p>
				</Card>
			</a>
		{/each}

		{#if $abilityResults.data.length < $abilityResults.totalItems}
			<Button
				on:click={() => {
					loadMoreAbilities();
				}}
			>
				Show {Math.min(10, $abilityResults.totalItems - $abilityResults.data.length)} more abilities
				({$abilityResults.data.length}/{$abilityResults.totalItems})
			</Button>
		{/if}
	</section>
</div>

<style>
	a {
		text-decoration: none;
	}
</style>
