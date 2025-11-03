<script lang="ts">
	import { theme } from '$lib/stores/domain';
	import Icon from '$/ui/atoms/icon/Icon.svelte';
	import Card from '$/ui/atoms/card/Card.svelte';
	import Image from '$/ui/atoms/image';
	import { createEventDispatcher } from 'svelte';
	import type { paths } from '$/@types/api';

	export let pokemon: paths['/pokemon/{id}/preview']['get']['responses']['200']['content']['application/json'];
	export let shiny: boolean | undefined;
	export let gender: 'male' | 'female' | undefined;
	export let showGenderAndShiny: boolean;
	export let isClickable = true;

	const dispatch = createEventDispatcher();
</script>

<Card
	id={pokemon.id.toString()}
	{isClickable}
	classes="relative h-auto p-8 text-center"
	style={`min-height: 150px;`}
	on:click={() => {
		dispatch('click', pokemon);
	}}
>
	<div class="spriteWrapper">
		{#if pokemon.sprite.url}
			<Image
				classNames="ml-auto mr-auto h-full max-w-min"
				src={pokemon.sprite.url}
				alt={pokemon.sprite.alt}
				loading="lazy"
				height="64px"
			/>
		{:else}
			<div />
		{/if}
	</div>
	<p>#{pokemon.id}</p>
	{#if pokemon?.name}
		<p>{pokemon.name}</p>
	{/if}

	<div class="indicators">
		{#if showGenderAndShiny && shiny}
			{#if $theme === 'light'}
				<Icon
					name="spark"
					style="margin-top: 0.2rem;"
					lineStroke="var(--text)"
					pathStroke="var(--text)"
				/>
			{:else}
				<Icon
					style="margin-top: 0.2rem;"
					name="spark-full"
					pathFill="var(--text)"
					lineStroke="var(--text)"
					pathStroke="var(--text)"
				/>
			{/if}
		{/if}

		{#if showGenderAndShiny && gender === 'female'}
			<Icon
				name="venus"
				style={`margin-top: 0.5rem; fill: ${$theme === 'dark' ? '#f6abd9' : '#ee5db7'};`}
			/>
		{:else if showGenderAndShiny && gender === 'male'}
			<Icon
				name="mars"
				style={`margin-top: 0.5rem; margin-bottom: auto; fill: ${
					$theme === 'dark' ? '#99b3ff' : '#3366ff'
				};`}
			/>
		{/if}

		<slot name="remove" />
	</div>
</Card>

<style>
	.indicators {
		position: absolute;
		top: 0;
		left: 0;
		text-align: center;
		height: 2rem;
		width: 100%;
		border-radius: 10%;
		z-index: 1;
		display: inline-flex;
		margin: 0;
		padding: 0.5rem;
		padding-left: 1rem;
	}

	.spriteWrapper {
		height: 96px;
		width: 96px;
		margin-left: auto;
		margin-right: auto;
		align-content: center;
	}

	p {
		word-wrap: normal;
	}
</style>
