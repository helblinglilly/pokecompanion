<script lang="ts">
	import Modal from '$/ui/molecules/Modal/Modal.svelte';
	import Image from '$/ui/atoms/Image.svelte';
	import type { APIPokemon } from '$/@types/api.pokecompanion';

	type Sprites = APIPokemon['sprites'];
	interface Props {
		sprites: Sprites;
	}

	let { sprites }: Props = $props();
	let primarySprite = $derived(sprites[0]);
	let secondarySprite = $derived(sprites[1]);

	let showModal = $state(false);
	let modalContent: Pick<Sprites[number], 'url' | 'alt' | 'isBack'> = $state({
		url: '',
		alt: 'placeholder',
		isBack: false
	});

	$effect(() => {
		const event = (event: KeyboardEvent) => {
			if (event.key === 'escape') {
				showModal = false;
			}
		};
		document.addEventListener('keypress', event);

		return () => {
			document.removeEventListener('keypress', event);
		};
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
			onclick={() => toggleModal(primarySprite)}
			onkeydown={(key) => {
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
			onclick={() => toggleModal(secondarySprite)}
			onkeydown={(key) => {
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
	{#snippet header()}
		<h2 class="h2">
			{modalContent.alt}
		</h2>
	{/snippet}

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
		min-height: 128px;
	}

	#modalImageWrapper {
		height: 300px;
		display: grid;
		align-items: center;
		justify-items: center;
		margin-top: 1rem;
	}
</style>
