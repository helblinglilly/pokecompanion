<script lang="ts">
	import {
		lastPokedexEntry,
		primaryLanguage,
		secondaryLanguage,
		selectedGame,
		animateSprites,
		versionSpecificSprites
	} from '$lib/stores/domain';
	import { getMultiLanguageName } from '$lib/utils/language';
	import Navigator from '$components/Navigator.svelte';
	import { getPokemonTypesInGame } from '$lib/data/generationAdjuster';
	import EvolutionChain from '$components/Pokemon/EvolutionChain.svelte';
	import Image from '$components/Image.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { isPokemonInGame } from '$lib/data/games';
	import Pokedex from '$components/Pokedex.svelte';
	import { currentUser } from '$lib/stores/user';
	import SelectedTags from '$components/Tags/SelectedTags.svelte';
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import { findBaseSprites, findPrimarySprite, findSecondarySprite } from '$lib/pokemon-id/sprites';
	import SpritePreview from '$components/Pokemon/SpritePreview.svelte';
	import Icon from '$components/Icon.svelte';

	export let data;

	let showFemaleSprite = false;
	let showShinySprite = false;

	const removeLastRouteFromURL = (url: string) => {
		if (!url) {
			return;
		}
		const parts = url.split('/');
		parts.pop();
		const modifiedURL = parts.join('/');
		return modifiedURL;
	};

	onMount(() => {
		document.addEventListener('keydown', (e) => {
			if (e.key === 'ArrowLeft' && data.id > 1) {
				goto(`/pokemon/${data.id - 1}`);
			} else if (e.key === 'ArrowRight' && data.id < lastPokedexEntry) {
				goto(`/pokemon/${data.id + 1}`);
			}
		});
	});

	$: baseSprite = findBaseSprites(
		data.pokemon.sprites,
		$versionSpecificSprites,
		$selectedGame?.cookieGroup,
		$animateSprites
	);
</script>

<svelte:head>
	<title
		>#{data.id}
		{`${getMultiLanguageName(data.species.names, $primaryLanguage, $secondaryLanguage)}`}</title
	>
</svelte:head>

<Breadcrumbs
	breadcrumbs={[
		{ display: 'Pokémon', url: `/pokemon?jumpTo=${data.id}` },
		{ display: `${data.id}` }
	]}
/>

<Navigator
	title={`${getMultiLanguageName(data.species.names, $primaryLanguage, $secondaryLanguage)}`}
	currentId={data.id}
	maxId={lastPokedexEntry}
	iconUrl={removeLastRouteFromURL(data.pokemon.sprites.front_default)}
	route="/pokemon"
/>

<div class="columns">
	<div class="column">
		<div class="card" style="padding-top: 1rem; position: relative;">
			<div style="height: 20px; display: inline-flex; width: 100%; justify-content: space-between;">
				<div style="display: inline-flex; height: 20px; width: 150px;">
					{#each getPokemonTypesInGame(data.pokemon, $selectedGame?.generation) as type}
						<Image src={type.icon} alt={type.name} style="margin-right: 4px; width: 50px;" />
					{/each}
				</div>
				<Pokedex flavourTextEntries={data.species.flavor_text_entries} />
			</div>

			<SpritePreview
				primarySprite={findPrimarySprite(baseSprite, showFemaleSprite, showShinySprite)}
				secondarySprite={findSecondarySprite(baseSprite, showFemaleSprite, showShinySprite)}
			/>

			{#if $currentUser}
				<SelectedTags
					newTagInitialContent={{ pokemon: [{ id: data.id, added: new Date().toISOString() }] }}
				/>
			{/if}
			{#if !isPokemonInGame(data.id, $selectedGame)}
				<p style="text-align: center; margin-top: 20px;">Pokémon is not present in game</p>
			{/if}

			{#if baseSprite.primary.shiny}
				<button
					class="triangle right"
					style={`border-bottom-color: ${showShinySprite ? '#f0e45f' : '#f0e45f'}`}
					on:click={() => {
						showShinySprite = !showShinySprite;
					}}
				>
					{#if showShinySprite}
						<Icon name="spark-full" style="margin-top: 1.8rem; margin-left: -2rem;" />
					{:else}
						<Icon name="spark" style="margin-top: 1.8rem; margin-left: -2rem;" />
					{/if}
				</button>
			{/if}

			{#if baseSprite.secondary.female}
				<button
					class="triangle left"
					style={`border-bottom-color: ${showFemaleSprite ? '#f6abd9' : '#7fbbf0'};`}
					on:click={() => {
						showFemaleSprite = !showFemaleSprite;
					}}
				>
					{#if showFemaleSprite}
						<Icon
							name="venus"
							style="margin-top: 2.1rem; margin-left: 0.6rem; fill: var(--dark);"
						/>
					{:else}
						<Icon name="mars" style="margin-top: 2.1rem; margin-left: 0.5rem; fill: var(--dark);" />
					{/if}
				</button>
			{/if}
		</div>
	</div>
	<div class="column">
		<div class="card" id="evolutions">
			<EvolutionChain evolutionChainUrl={data.species.evolution_chain.url} />
		</div>
	</div>
</div>
