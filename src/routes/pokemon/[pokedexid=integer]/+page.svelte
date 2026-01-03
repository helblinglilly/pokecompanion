<script lang="ts">
	import { goto } from '$app/navigation';

	import { page } from '$app/state';

	import Card from '$/ui/atoms/Card.svelte';
	import TypeMatchup from './TypeMatchup.svelte';
	import BaseStats from './BaseStats.svelte';
	import MovesetCard from './MovesetCard.svelte';
	import Breadcrumbs from '$/lib/components/Breadcrumbs.svelte';
	import Abilities from './Abilities.svelte';
	import Encounters from './Encounters.svelte';
	import EvolutionChain from './EvolutionChain.svelte';

	import Navigator from './Navigator.svelte';
	import PokemonCard from './PokemonCard.svelte';

	let { data } = $props();

	$effect(() => {
		const event = (e: KeyboardEvent) => {
			if (e.key === 'ArrowLeft' && data.id > 1) {
				goto(`/pokemon/${data.id - 1}`);
			} else if (e.key === 'ArrowRight' && data.id < (data.lastPokedexEntry ?? 1)) {
				goto(`/pokemon/${data.id + 1}`);
			}
		};
		document.addEventListener('keydown', event);

		return () => {
			document.removeEventListener('keydown', event);
		};
	});
</script>

<svelte:head>
	<title>{data.__meta.title}</title>
	<meta property="og:title" content={data.__meta.title} />
	<meta name="twitter:title" content={data.__meta.title} />

	<meta name="description" content={data.__meta.description} />
	<meta property="og:description" content={data.__meta.description} />
	<meta name="twitter:description" content={data.__meta.description} />

	<meta property="og:type" content="website" />

	<meta property="og:url" content={page.url.origin} />
	<meta property="twitter:url" content={page.url.origin} />
	<meta property="twitter:domain" content={page.url.hostname} />

	<meta name="twitter:card" content="summary_large_image" />

	<meta property="og:image" content={data.__meta.previewImage} />
	<meta name="twitter:image" content={data.__meta.previewImage} />
</svelte:head>

<Breadcrumbs
	breadcrumbs={[
		{ display: 'Pokémon', url: `/pokemon?jumpTo=${data.id}#${data.id}` },
		{ display: `${data.id}` }
	]}
/>

{#key `${data.id}-${page.url.searchParams.get('variety')}-${page.url.searchParams.get('shiny')}-${page.url.searchParams.get('gender')}`}
	<div class="grid gap-4">
		<Navigator title={`${data.name}`} currentId={data.id} varieties={data.varieties} />

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			<Card classes="relative min-h-[250px] h-fit">
				<PokemonCard {data} />
			</Card>

			<Card>
				<h3 class="h3 mb-4">Evolutions</h3>
				<EvolutionChain evolutions={data.evolutionChain} />
			</Card>

			<Card>
				<h3 class="h3 mb-4">Type matchup</h3>
				<TypeMatchup types={data.types} />
			</Card>

			<Card>
				<h3 class="h3 mb-4">Base stats</h3>
				<BaseStats data={data.stats} />
			</Card>

			<Card>
				<h3 class="h3">Encounters</h3>
				<Encounters encounterData={data.encounters} />
			</Card>

			<Card>
				<h3 class="h3 mb-4">Abilities</h3>
				<Abilities abilities={data.abilities} />
			</Card>
		</div>

		<Card>
			<h3 class="h3">Moveset</h3>
			<MovesetCard skeletonData={data.moves} movePromise={data.fullMoves} />
		</Card>
	</div>
{/key}
