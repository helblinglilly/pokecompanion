<script lang="ts">
	import { theme } from '$lib/stores/domain';
	import Icon from '$/ui/atoms/icon/Icon.svelte';
	import Card from '$/ui/atoms/card';
	import Image from '$/ui/atoms/image';
	import type { paths } from '$/@types/api';

	interface Props {
		pokemon: paths['/pokemon/{id}/preview']['get']['responses']['200']['content']['application/json'];
		shiny: boolean | undefined;
		gender: 'male' | 'female' | undefined;
		showGenderAndShiny?: boolean;
		cardActiveState?: boolean;
		remove?: import('svelte').Snippet;
		onclick?: (_: any) => void;
	}

	let {
		pokemon,
		shiny,
		gender,
		showGenderAndShiny = false,
		cardActiveState = $bindable(false),
		remove,
		onclick
	}: Props = $props();
</script>

<Card
	ariaLabel={pokemon.name}
	classes="m-0 w-full inline-flex justify-between h-28"
	isClickable
	id={pokemon.id.toString()}
	style={`position: relative; padding: 0.5rem; ${
		cardActiveState ? 'background-color: var(--card-hover);' : ''
	}`}
	onclick={() => {
		if (onclick) {
			onclick(pokemon);
		}
		cardActiveState = true;
	}}
>
	<div class="inline-flex">
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
				<div></div>
			{/if}
		</div>

		<p style="margin-top: auto; margin-bottom: auto;">
			#{pokemon.id}
			{pokemon.name}
		</p>
	</div>

	<div class="mr-4 content-center inline-flex">
		{#if showGenderAndShiny}
			{#if shiny}
				{#if $theme === 'light'}
					<Icon
						name="spark"
						style="margin-top: 2rem"
						lineStroke="var(--text)"
						pathStroke="var(--text)"
					/>
				{:else}
					<Icon
						name="spark-full"
						style="margin-top: 2rem"
						pathFill="var(--text)"
						lineStroke="var(--text)"
						pathStroke="var(--text)"
					/>
				{/if}
			{/if}

			{#if gender === 'female'}
				<Icon
					name="venus"
					style={`fill: ${$theme === 'dark' ? '#f6abd9' : '#ee5db7'}; margin-top: 2.3rem;`}
				/>
			{:else if gender === 'male'}
				<Icon
					name="mars"
					style={`fill: ${$theme === 'dark' ? '#99b3ff' : '#3366ff'}; margin: auto;`}
				/>
			{:else}
				<div style="width: 1rem;"></div>
			{/if}
		{/if}
	</div>
	{@render remove?.()}
</Card>

<style>
	.spriteWrapper {
		height: 96px;
		width: 96px;
		padding: 1rem;
		margin-left: auto;
		margin-right: auto;
		align-content: center;
	}
</style>
