<script lang="ts">
	import Breadcrumbs from '$/lib/components/Breadcrumbs.svelte';
	import SocialPreview from '$/lib/components/SocialPreview.svelte';
	import PageNavigator from '$/routes/pokemon/PageNavigator.svelte';
	import PokemonListEntry from '$/ui/molecules/pokemon/list';

	let { data } = $props();
</script>

<SocialPreview
	title={data.pokedex.__meta.title}
	description={data.pokedex.__meta.description}
	previewImage="https://socialpreviews.pokecompanion.helbling.uk/generic.png"
/>

<div class="inline-grid md:inline-flex w-full gap-4 mb-4 md:justify-between">
	<h1 class="h1">{data.pokedex.pokedex.name}</h1>

	<div class="inline-flex gap-4 content-cente justify-center md:justify-end">
		<PageNavigator pagination={data.pokedex.pagination} />
	</div>
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
	{#each data.pokedex.pokemon as pokemon}
		<a
			id={`${pokemon.id}`}
			href={pokemon.pokedex.pokedexSlug + `?gameEntry=${data.pokedex.games[0]}`}
		>
			<PokemonListEntry
				pokemon={{
					...pokemon,
					id: pokemon.pokedex.pokedexId
				}}
				shiny={false}
				gender={undefined}
			/>
		</a>
	{/each}
</div>

<div class="columns mt-4">
	<div class="column flex content-center justify-center gap-4">
		<PageNavigator pagination={data.pokedex.pagination} />
	</div>
</div>
