<script lang="ts">
	import PokemonDetails from '$/routes/pokemon/[pokedexid=integer]/PokemonDetails.svelte';
	import Navigator from '$/features/pokedex/pokemon/Navigator.svelte';
	import VarietySelector from '$/features/pokedex/pokemon/VarietySelector.svelte';
	import Breadcrumbs from '$/lib/components/Breadcrumbs.svelte';
	import SocialPreview from '$/lib/components/SocialPreview.svelte';
	import { currentUser } from '$/lib/stores/user.js';
	import { page } from '$app/state';
	import { PUBLIC_API_HOST } from '$app/env/public';
	import { get } from 'svelte/store';

	let { data } = $props();
	const navigation = $derived(data.pokedex.navigation);
	$effect(() => {
		const user = get(currentUser);
		if (!user) return;

		const controller = new AbortController();

		const gender =
			['male', 'female'].find((entry) => entry === page.url.searchParams.get('gender')) ?? null;
		const shiny = page.url.searchParams.get('shiny') === 'true';
		const variety = page.url.searchParams.get('variety');

		fetch(`${PUBLIC_API_HOST}/lastAction`, {
			method: 'PATCH',
			signal: controller.signal,
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pokemon: {
					pokedexId: Number(page.params.pokedexid),
					pokemonInPokedexId: Number(page.params.pokemonid),
					gender,
					shiny,
					variety
				}
			})
		}).catch((err) => {
			if (err.name !== 'AbortError') console.error(err);
		});

		// Cleanup: abort if user navigates away or effect re-runs
		return () => controller.abort();
	});
</script>

<SocialPreview
	title={data.pokedex.__meta.title}
	description={data.pokedex.__meta.description}
	previewImage="https://static.pokecompanion.com/social-previews/generic.png"
/>

<Breadcrumbs
	breadcrumbs={[
		{ display: 'Pokédex', url: `/pokedex` },
		{
			display: data.pokedex.pokedex.name,
			url:
				data.pokedex.pokedex.slug +
				`?jumpTo=${data.pokedex.navigation.current.pokedexId}#${data.pokedex.navigation.current.pokedexId}`
		},
		{ display: `${data.pokedex.navigation.current.pokedexId}` }
	]}
/>

<Navigator previous={navigation.previous} current={navigation.current} next={navigation.next}>
	<VarietySelector varieties={data.pokemon.varieties} classes="py-2" />
</Navigator>

{#key `${data.pokemon.id}-${page.url.searchParams.get('variety')}-${page.url.searchParams.get('shiny')}-${page.url.searchParams.get('gender')}`}
	<PokemonDetails
		pokemon={data.pokemon}
		abilities={data.abilities}
		fullMoves={data.fullMoves}
		onlyShowCurrentGames
	/>
{/key}
