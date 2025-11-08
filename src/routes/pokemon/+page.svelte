<script lang="ts">
	import SocialPreview from '$/lib/components/SocialPreview.svelte';
	import PokemonListEntry from '$/ui/molecules/pokemon/list';
	import PageNavigator from './PageNavigator.svelte';

	export let data;
</script>

<SocialPreview
	title="Pokémon"
	previewImage="https://socialpreviews.pokecompanion.helbling.uk/pokemonPage.png"
/>

<div class="inline-grid md:inline-flex w-full gap-4 mb-4 md:justify-between">
	<h1 class="h1">All Pokémon</h1>

	<div class="inline-flex gap-4 content-cente justify-center md:justify-end">
		<PageNavigator pagination={data.pagination} />
	</div>
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
	{#each data.pokemon as pokemon}
		<a id={`${pokemon.id}`} href={pokemon.slug}>
			<PokemonListEntry {pokemon} shiny={false} gender={undefined} />
		</a>
	{/each}
</div>

<div class="columns mt-4">
	<div class="column flex content-center justify-center gap-4">
		<PageNavigator pagination={data.pagination} />
	</div>
</div>
