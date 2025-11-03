<script lang="ts">
	import { onMount } from 'svelte';
	import Modal from '$/ui/molecules/Modal/Modal.svelte';
	import Image from '$/ui/atoms/image/Image.svelte';
	import type { APIPokemon } from '$/@types/api.pokecompanion';

	type Sprites = APIPokemon['sprites'];
	export let sprites: Sprites;

	let primarySprite: Sprites[number] | undefined;
	let secondarySprite: Sprites[number] | undefined;
	$: [primarySprite, secondarySprite] = sprites ?? [];

	let showModal = false;
	let modalContent: Pick<Sprites[number], 'url' | 'alt' | 'isBack'> = {
		url: '',
		alt: 'placeholder',
		isBack: false
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

	let toggleModal = (newContent: Sprites[number] | undefined) => {
		if (newContent) {
			modalContent = newContent;
			showModal = true;
		}
		window?.umami?.track('PokemonSpriteModal');
	};
</script>

<div class="columns mobile py-2">
	{#if primarySprite}
		<div
			class="column spriteBoxWrapper"
			on:click={() => toggleModal(primarySprite)}
			on:keydown={(key) => {
				if (key.key === 'space' || key.key === 'enter') {
					toggleModal(primarySprite);
				}
			}}
			role="button"
			tabindex="-1"
		>
			<Image
				src={primarySprite.url}
				alt={primarySprite.alt}
				id="primarySprite"
				style="max-width: 128px;"
			/>
		</div>
	{/if}

	{#if secondarySprite?.url && secondarySprite.isBack}
		<div
			class="column spriteBoxWrapper"
			on:click={() => toggleModal(secondarySprite)}
			on:keydown={(key) => {
				if (key.key === 'space' || key.key === 'enter') {
					toggleModal(secondarySprite);
				}
			}}
			role="button"
			tabindex="-1"
		>
			{#if secondarySprite}
				<Image
					src={secondarySprite.url}
					alt={secondarySprite.alt}
					id="secondarySprite"
					style="width: 128px; max-height: 178px;"
				/>
			{/if}
		</div>
	{/if}
</div>

<Modal bind:showModal>
	<h2 class="h2" slot="header">
		{modalContent.alt}
	</h2>

	<div id="modalImageWrapper">
		<Image
			src={modalContent.url}
			style="margin-left: auto; margin-right: auto; height: inherit;"
			alt={modalContent.alt}
			id={`modalImage${modalContent.isBack ? '-back' : ''}`}
		/>
	</div>
</Modal>

<style>
	div.spriteBoxWrapper {
		display: grid;
		align-content: center;
		justify-content: center;
	}

	#modalImageWrapper {
		height: 300px;
		display: grid;
		align-items: center;
		justify-items: center;
		margin-top: 1rem;
	}
</style>
