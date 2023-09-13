<script lang="ts">
	import type { IPokemon, ISprites } from '$lib/apiTypes';
	import {
		findBaseSprites,
		findPrimarySprite,
		findSecondarySprite,
		type ISpriteImage
	} from '$lib/pokemon-id/sprites';
	import { onMount } from 'svelte';
	import Modal from '../Modal.svelte';
	import { getLanguageEntry } from '$lib/utils/language';
	import { primaryLanguage } from '$lib/domain';
	import PokemonNames from '$lib/data/pokemonNames.json';

	export let sprites: ISprites;
	export let pokemon: IPokemon;

	$: baseSprite = findBaseSprites(sprites);

	$: hasShiny = baseSprite.front_shiny || baseSprite.back_shiny ? true : false;
	$: isDisplayingShiny = false;

	$: hasFemale = baseSprite.front_female || baseSprite.back_female ? true : false;
	$: isDisplayingFemale = false;

	$: secondarySprite = findSecondarySprite(
		baseSprite,
		hasFemale,
		isDisplayingFemale,
		hasShiny,
		isDisplayingShiny
	);

	$: primarySprite = findPrimarySprite(
		baseSprite,
		hasFemale,
		isDisplayingFemale,
		hasShiny,
		isDisplayingShiny
	);

	let showModal = false;
	let modalContent: ISpriteImage = {
		url: '',
		alt: ''
	};

	onMount(() => {
		document.addEventListener('keypress', (event) => {
			if (event.key === 'escape') {
				showModal = false;
			}
		});
	});

	let toggleModal = (newContent: ISpriteImage) => {
		modalContent = newContent;
		showModal = true;
	};
</script>

<div style="display: flex; justify-content: space-around;">
	<div
		class="spriteBoxWrapper"
		on:click={() => toggleModal(primarySprite)}
		on:keydown={() => toggleModal(primarySprite)}
		role="button"
		tabindex="-1"
	>
		<i>{primarySprite.alt}</i>
		<div class="spriteWrapper">
			<img src={primarySprite.url} alt={primarySprite.alt} loading="lazy" />
		</div>
	</div>

	<div
		class="spriteBoxWrapper"
		on:click={() => toggleModal(secondarySprite)}
		on:keydown={() => toggleModal(secondarySprite)}
		role="button"
		tabindex="-1"
	>
		<i>{secondarySprite.alt}</i>
		<div class="spriteWrapper">
			{#if secondarySprite}
				<img src={secondarySprite.url} alt={secondarySprite.alt} loading="lazy" />
			{/if}
		</div>
	</div>
</div>

<div style="display: flex; justify-content: space-around;">
	{#if hasShiny}
		<span>
			<input
				type="checkbox"
				name="shinyToggle"
				id="shinyToggle"
				on:change={() => (isDisplayingShiny = !isDisplayingShiny)}
				checked={isDisplayingShiny}
			/>
			<label class="checkbox" for="shinyToggle">Shiny</label>
		</span>
	{/if}

	{#if hasFemale}
		<span>
			<input
				type="checkbox"
				name="alternative"
				id="alternative"
				on:change={() => {
					isDisplayingFemale = !isDisplayingFemale;
				}}
				checked={isDisplayingFemale}
			/>
			<label class="checkbox" for="alternative">Female</label>
		</span>
	{/if}
</div>

<Modal bind:showModal>
	<h2 slot="header">
		{getLanguageEntry(PokemonNames[pokemon.id - 1].names, $primaryLanguage)} -
		{modalContent.alt}
	</h2>

	<div>
		<img
			src={modalContent.url}
			style="width: 256px; height: 256px; margin-left: auto; margin-right: auto;"
			alt={modalContent.alt}
		/>
	</div>
</Modal>

<!-- Open a modal when the user clicks on either sprite to showcase all sprites -->
<style>
	div.spriteBoxWrapper {
		text-align: center;
		width: 96px;
	}
	div.spriteWrapper {
		width: 96px;
		height: 96px;
	}
</style>
