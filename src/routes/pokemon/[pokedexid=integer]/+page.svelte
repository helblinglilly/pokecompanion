<script lang="ts">
	import { lastPokedexEntry } from '$lib/stores/domain';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';
	import { pokemonDisplayStore } from '$lib/stores/pokemonPage';

	import { tagStore } from '$lib/stores/tags';
	import SocialPreview from '$/lib/components/SocialPreview.svelte';

	import Card from '$/ui/atoms/card/Card.svelte';
	import TypeMatchup from './TypeMatchup.svelte';
	import BaseStats from './BaseStats.svelte';
	import MovesetCard from './MovesetCard.svelte';
	import Breadcrumbs from '$/lib/components/Breadcrumbs.svelte';
	import Abilities from './Abilities.svelte';
	import Encounters from './Encounters.svelte';
	import EvolutionChain from './EvolutionChain.svelte';

	import Navigator from './Navigator.svelte';
	import PokemonCard from './PokemonCard.svelte';

	export let data;

	$: {
		if (data) {
			const showFemaleSpriteIfExists = $page.url.searchParams.get('gender') === 'female';
			const showShinySpriteIfExists = $page.url.searchParams.get('shiny') === 'true';
			const varietyName = $page.url.searchParams.get('variety');

			pokemonDisplayStore.set({
				id: data.id,
				showFemaleSpriteIfExists,
				hasFemaleSprite: data.sprites.some((sprite) => sprite.hasFemale),
				gender: data.sprites.some((sprite) => sprite.hasFemale)
					? showFemaleSpriteIfExists
						? 'female'
						: 'male'
					: undefined,
				showShinySpriteIfExists,
				hasShinySprite: data.sprites.some((sprite) => sprite.hasShiny),
				variety: varietyName ?? undefined,
				transferableQueryParams: '' // Gets auto-updated within the store anyway
			});

			tagStore.set(data.tags);
		}
	}

	const changeUrlQueryParam = (param: string, value: string) => {
		const newUrl = new URL($page.url);
		newUrl.searchParams.set(param, value);
		goto(newUrl.toString(), { replaceState: true, noScroll: true });
	};

	const deleteUrlQueryParam = (param: string) => {
		const newUrl = new URL($page.url);
		newUrl.searchParams.delete(param);
		goto(newUrl.toString(), { replaceState: true, noScroll: true });
	};

	$: {
		if (
			$pokemonDisplayStore.showFemaleSpriteIfExists !==
			($page.url.searchParams.get('gender') === 'female')
		) {
			changeUrlQueryParam(
				'gender',
				$pokemonDisplayStore.showFemaleSpriteIfExists ? 'female' : 'male'
			);
		}
	}

	$: {
		if (
			$pokemonDisplayStore.showShinySpriteIfExists !==
			($page.url.searchParams.get('shiny') === 'true')
		) {
			if ($pokemonDisplayStore.showShinySpriteIfExists) {
				changeUrlQueryParam('shiny', 'true');
			} else {
				deleteUrlQueryParam('shiny');
			}
		}
	}

	onMount(() => {
		document.addEventListener('keydown', (e) => {
			if (e.key === 'ArrowLeft' && data.id > 1) {
				goto(`/pokemon/${data.id - 1}`);
			} else if (e.key === 'ArrowRight' && data.id < lastPokedexEntry) {
				goto(`/pokemon/${data.id + 1}`);
			}
		});
	});
</script>

<SocialPreview
	title={data.__meta.title}
	previewImage={data.__meta.previewImage}
	description={data.__meta.description}
/>

<Breadcrumbs
	breadcrumbs={[
		{ display: 'Pokémon', url: `/pokemon?jumpTo=${data.id}` },
		{ display: `${data.id}` }
	]}
/>

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
		<MovesetCard movesetData={data.moves} />
	</Card>
</div>
