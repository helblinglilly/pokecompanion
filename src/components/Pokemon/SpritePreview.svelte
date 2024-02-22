<script lang="ts">
	import Modal from '$components/UI/Modal.svelte';
	import type { ISpriteImage } from '$lib/pokemon-id/sprites';
	import { onMount } from 'svelte';
	import Image from '$components/UI/Image.svelte';

	export let primarySprite: ISpriteImage;
	export let secondarySprite: ISpriteImage;

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

<div class="columns mobile" style="min-height: 178px;">
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
			style="width: 128px; max-height: 178px;"
		/>
	</div>

	{#if secondarySprite.url}
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
			id="modalImage"
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
		width: 300px;
		height: 300px;
		display: grid;
		align-content: center;
	}
</style>
