<script lang="ts">
	import type { IGameGroups } from '$/lib/data/games';
	import { selectedGame } from '$/lib/stores/domain';
	import Image from '$/ui/atoms/image/Image.svelte';
	import { getSpriteURL } from '$/ui/atoms/pokemon/sprite/helper';
	import { onMount } from 'svelte';

	export let id: number;
	export let shiny = false;
	export let female = false;
	export let variety = '';
	export let style = '';
	export let gameOverride: IGameGroups | undefined = undefined;
	export let imageClasses = '';

	const fallbackSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

	let spriteURL: string | null = null;

	let isMounted = false;
	onMount(() => {
		isMounted = true;
	});
	$: {
		const game = gameOverride ?? $selectedGame;
		const fetchSpriteURL = async () => {
			spriteURL = await getSpriteURL(id, shiny, female, variety, game).catch((err) => {
				return fallbackSpriteUrl;
			});
		};
		if (isMounted) {
			fetchSpriteURL();
		}
	}
</script>

<div class="spriteWrapper" {style}>
	{#if spriteURL}
		<Image
			classNames={`ml-auto mr-auto h-full max-w-min ${imageClasses}`}
			src={spriteURL}
			alt={`sprite`}
			loading="lazy"
			height="64px"
		/>
	{:else}
		<div />
	{/if}
</div>

<style>
	.spriteWrapper {
		height: 96px;
		width: 96px;
		padding: 1rem;
		align-content: center;
	}
</style>
