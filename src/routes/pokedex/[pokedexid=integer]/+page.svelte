<script lang="ts">
	import CreateNewTag from '$/features/tags/new/CreateNewTag.svelte';
	import SocialPreview from '$/lib/components/SocialPreview.svelte';
	import { currentUser } from '$/lib/stores/user.js';
	import PageNavigator from '$/routes/pokemon/PageNavigator.svelte';
	import PokemonListEntry from '$/ui/molecules/pokemon/list';
	import { PUBLIC_API_HOST } from '$env/static/public';

	let { data } = $props();
</script>

<SocialPreview
	title={data.pokedex.__meta.title}
	description={data.pokedex.__meta.description}
	previewImage="https://socialpreviews.pokecompanion.helbling.uk/generic.png"
/>

<div class="inline-grid md:inline-flex w-full gap-4 mb-4 md:justify-between">
	<h1 class="h1">{data.pokedex.pokedex.name}</h1>

	<div class="inline-flex gap-4 content-center justify-start md:justify-end">
		{#if $currentUser}
			<!-- <Button onclick={async () => {}}>Turn into Tag</Button> -->
			<CreateNewTag
				contents={{
					pokemon: [],
					move: []
				}}
				onSuccess={async (tagId) => {
					await fetch(`${PUBLIC_API_HOST}/tags/${tagId}/pokedex/${data.pokedex.pokedex.id}`, {
						credentials: 'include',
						method: 'PATCH'
					});
				}}
			/>
		{/if}
	</div>
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
	{#each data.pokedex.pokemon as pokemon}
		<a
			id={`${pokemon.id}`}
			href={pokemon.pokedex?.pokedexSlug + `?gameEntry=${data.pokedex.games[0]}`}
		>
			<PokemonListEntry
				pokemon={{
					...pokemon,
					id: pokemon.pokedex?.pokedexId ?? pokemon.id
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
