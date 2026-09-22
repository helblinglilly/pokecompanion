<script lang="ts">
	import { Logger } from '$/debt/log';
	import { meta } from '$/lib/stores/domain';
	import Card from '$/ui/atoms/Card.svelte';
	import Image from '$/ui/atoms/Image.svelte';
	import { page } from '$app/state';

	interface Props {
		pokedexId: number;
	}

	let { pokedexId }: Props = $props();

	const urlWithoutVariety = $derived(() => {
		const url = new URL(page.url);
		url.searchParams.delete('variety');
		return url.search;
	});

	const iconUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
</script>

<div class="navigation-button">
	{#if pokedexId > 0 && pokedexId <= $meta.lastPokedexEntry}
		<a
			href={`/pokemon/${pokedexId}${urlWithoutVariety()}`}
			onclick={() => {
				Logger.addPageAction('PokemonNavigation');
			}}
		>
			<Card classes="w-fit h-auto inline-flex m-0 p-2 min-h-8" isClickable>
				<p class="m-auto hidden sm:block">#{pokedexId}</p>
				{#if iconUrl}
					<Image
						src={`${iconUrl}/${pokedexId}.png`}
						isSprite
						alt="icon"
						classNames="icon w-12"
						loading="eager"
					/>
				{:else}
					<Image src="/placeholder.png" alt="icon" classNames="icon" loading="eager" />
				{/if}
			</Card>
		</a>
	{:else}
		<div class="min-w-20">&nbsp;</div>
	{/if}
</div>
