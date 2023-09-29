<script lang="ts">
	import type { ISprites } from '$lib/types/IPokemon';
	import {
		findBaseSprites,
		findPrimarySprite,
		findSecondarySprite,
		type ISpriteImage
	} from '$lib/pokemon-id/sprites';
	import { onMount } from 'svelte';
	import Modal from '../Modal.svelte';
	import { animateSprites, selectedGame, versionSpecificSprites } from '$lib/domain';
	import Image from '../Image.svelte';

	export let sprites: ISprites;

	$: baseSprite = findBaseSprites(sprites, $versionSpecificSprites, $selectedGame, $animateSprites);

	$: hasShiny = baseSprite.primary.shiny ? true : false;
	$: isDisplayingShiny = false;

	$: hasFemale = baseSprite.primary.female ? true : false;
	$: isDisplayingFemale = false;

	$: secondarySprite = findSecondarySprite(baseSprite, isDisplayingFemale, isDisplayingShiny);

	$: primarySprite = findPrimarySprite(baseSprite, isDisplayingFemale, isDisplayingShiny);

	let showModal = false;
	let modalContent: ISpriteImage = {
		url: '',
		alt: ''
	};

	let hasMounted = false;
	onMount(() => {
		document.addEventListener('keypress', (event) => {
			if (event.key === 'escape') {
				showModal = false;
			}
		});
		hasMounted = true;
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
		on:keydown={(key) => {
			if (key.key === 'space' || key.key === 'enter') {
				toggleModal(primarySprite);
			}
		}}
		role="button"
		tabindex="-1"
	>
		<div class="spriteWrapper">
			<Image src={primarySprite.url} alt={primarySprite.alt} id="primarySprite" width="100%" />
		</div>
	</div>

	{#if secondarySprite.url}
		<div
			class="spriteBoxWrapper"
			on:click={() => toggleModal(secondarySprite)}
			on:keydown={(key) => {
				if (key.key === 'space' || key.key === 'enter') {
					toggleModal(secondarySprite);
				}
			}}
			role="button"
			tabindex="-1"
		>
			<div class="spriteWrapper">
				{#if secondarySprite}
					<Image src={secondarySprite.url} alt={secondarySprite.alt} id="secondarySprite" />
				{/if}
			</div>
		</div>
	{/if}
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
		{modalContent.alt}
	</h2>

	<div id="modalImageWrapper">
		<Image
			src={modalContent.url}
			style="margin-left: auto; margin-right: auto; width: 100%; height: auto;"
			alt={modalContent.alt}
			id="modalImage"
		/>
	</div>
</Modal>

<style>
	div.spriteBoxWrapper {
		text-align: center;
		width: 30vw;
		max-width: 178px;
	}
	div.spriteWrapper {
		max-width: 178px;
		max-height: 178px;
		width: 30vw;
		height: 30vw;
	}

	#primarySprite {
		width: 100%;
	}

	#secondarySprite {
		width: 100%;
	}

	#modalImageWrapper {
		width: 300px;
		height: 300px;
	}
</style>
