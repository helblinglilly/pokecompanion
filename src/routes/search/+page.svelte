<script lang="ts">
	import type { paths } from '$/@types/api.js';
	import { addSettingsAsSearchParams } from '$/lib/api/clientFetch.js';
	import SocialPreview from '$/lib/components/SocialPreview.svelte';
	import { addNotification } from '$/lib/stores/notifications';
	import { searchTerm } from '$/lib/stores/searchbar.js';
	import Button from '$/ui/atoms/button';
	import MoveListEntry from '$/ui/molecules/move/list/MoveListEntry.svelte';
	import PokemonListEntry from '$/ui/molecules/pokemon/list/PokemonListEntry.svelte';
	import { page } from '$app/stores';
	import { PUBLIC_API_HOST } from '$env/static/public';
	import { writable } from 'svelte/store';

	export let data;
	searchTerm.set(data.searchTerm);

	const pokemonResults = writable(data.pokemon);
	const moveResults = writable(data.moves);

	let pokemonPage = 1;
	let movesPage = 1;

	async function loadMorePokemon() {
		try {
			const url = addSettingsAsSearchParams(
				new URL(`${PUBLIC_API_HOST}/search/pokemon`),
				$page.url
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
			const url = addSettingsAsSearchParams(new URL(`${PUBLIC_API_HOST}/search/moves`), $page.url);

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
				Show {10} more Pokémon ({$pokemonResults.data.length}/{$pokemonResults.totalItems})
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
				Show {10} more Moves ({$moveResults.data.length}/{$moveResults.totalItems})
			</Button>
		{/if}
	</section>
</div>

<style>
	a {
		text-decoration: none;
	}
</style>
