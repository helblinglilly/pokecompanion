<script lang="ts">
	import Navigator from '$/features/pokedex/pokemon/Navigator.svelte';
	import VarietySelector from '$/features/pokedex/pokemon/VarietySelector.svelte';
	import Breadcrumbs from '$/lib/components/Breadcrumbs.svelte';
	import SocialPreview from '$/lib/components/SocialPreview.svelte';
	import { currentUser } from '$/lib/stores/user.js';
	import Abilities from '$/routes/pokemon/[pokedexid=integer]/Abilities.svelte';
	import BaseStats from '$/routes/pokemon/[pokedexid=integer]/BaseStats.svelte';
	import Encounters from '$/routes/pokemon/[pokedexid=integer]/Encounters.svelte';
	import EvolutionChain from '$/routes/pokemon/[pokedexid=integer]/EvolutionChain.svelte';
	import MovesetCard from '$/routes/pokemon/[pokedexid=integer]/MovesetCard.svelte';
	import PokemonCard from '$/routes/pokemon/[pokedexid=integer]/PokemonCard.svelte';
	import TypeMatchup from '$/routes/pokemon/[pokedexid=integer]/TypeMatchup.svelte';
	import Card from '$/ui/atoms/Card.svelte';
	import { page } from '$app/state';
	import { PUBLIC_API_HOST } from '$env/static/public';
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
	previewImage="https://socialpreviews.pokecompanion.helbling.uk/generic.png"
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
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
		<Card classes="relative">
			<PokemonCard data={data.pokemon} />
		</Card>

		<Card classes="">
			<h3 class="h3 mb-4">Evolutions</h3>
			<EvolutionChain evolutions={data.pokemon.evolutionChain} />
		</Card>

		<Card classes="">
			<h3 class="h3 mb-4">Type matchup</h3>
			<TypeMatchup types={data.pokemon.types} />
		</Card>

		<Card>
			<h3 class="h3 mb-4">Base stats</h3>
			<BaseStats data={data.pokemon.stats} />
		</Card>

		<Card>
			<h3 class="h3">Encounters</h3>
			<Encounters encounterData={data.pokemon.encounters} onlyShowCurrentGames={true} />
		</Card>

		<Card>
			<h3 class="h3 mb-4">Abilities</h3>
			<Abilities abilities={data.abilities} />
		</Card>
	</div>

	<Card classes="mt-4">
		<h3 class="h3">Moveset</h3>
		<MovesetCard
			skeletonData={data.pokemon.moves}
			movePromise={data.fullMoves}
			onlyShowCurrentGames={true}
		/>
	</Card>
{/key}
