<script lang="ts">
	import Card from '$/ui/atoms/Card.svelte';
	import Image from '$/ui/atoms/Image.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { getPokedexPokemon } from './api';

	import type { Snippet } from 'svelte';

	let {
		previous,
		current,
		next,
		children
	}: Awaited<ReturnType<typeof getPokedexPokemon>>['navigation'] & { children?: Snippet } =
		$props();

	const displayNationalDex = $derived(
		![
			'1', // National
			'2' // Kanto
			// 26, Let's Go, is the same but includes Meltan and Melmetal which needs their own entries
		].includes(`${page.params.pokedexid}`)
	);

	$effect(() => {
		const event = (e: KeyboardEvent) => {
			if (e.key === 'ArrowLeft' && previous) {
				goto(previous.slug);
			} else if (e.key === 'ArrowRight' && next) {
				goto(next.slug);
			}
		};
		document.addEventListener('keydown', event);

		return () => {
			document.removeEventListener('keydown', event);
		};
	});

	let innerWidth = $state(750);
</script>

<svelte:window bind:innerWidth />

{#snippet navigationButton(
	contents: Awaited<ReturnType<typeof getPokedexPokemon>>['navigation']['next']
)}
	{#if contents}
		<a href={contents.slug}>
			<Card classes="w-fit h-auto inline-flex m-0 p-2 min-h-8" isClickable>
				<p class="m-auto hidden sm:block">#{contents.pokedexId}</p>
				<Image
					src={contents.pokemon.sprite.url}
					alt={contents.pokemon.name}
					isSprite
					classNames="icon w-12"
				/>
			</Card>
		</a>
	{:else}
		<div class="min-w-20">&nbsp;</div>
	{/if}
{/snippet}

{#snippet nationalDexLink()}
	{#if displayNationalDex}
		<a href={`/pokedex/1?jumpTo=${current.speciesId}#${current.speciesId}`} class="content-center">
			<p class="my-auto text-center">#{current.speciesId}</p>
		</a>
	{/if}
{/snippet}

<div class="grid gap-2">
	{#if innerWidth < 450}
		<div class="w-full grid gap-2">
			<div class="inline-flex w-full justify-between gap-4">
				{@render navigationButton(previous)}
				<div class="grid gap-0 content-center">
					<h2 class="h2">#{current.pokedexId}</h2>
					{@render nationalDexLink()}
				</div>
				{@render navigationButton(next)}
			</div>
			<h1 class="h2 my-auto text-center">{current.pokemon.name}</h1>
			{#if children}
				{@render children()}
			{/if}
		</div>
	{:else}
		<div class="w-full inline-flex justify-between gap-2">
			{@render navigationButton(previous)}
			<div class="grid gap-0">
				<h1 class="h2 my-auto text-center mb-0 pb-0">
					#{current.pokedexId}
					{current.pokemon.name}
				</h1>
				{@render nationalDexLink()}
				{#if children}
					{@render children()}
				{/if}
			</div>
			{@render navigationButton(next)}
		</div>
	{/if}
</div>
