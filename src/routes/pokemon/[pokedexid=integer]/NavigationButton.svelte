<script lang="ts">
	import { Logger } from '$/debt/log';
	import { meta } from '$/lib/stores/domain';
	import Card from '$/ui/atoms/card';
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

<div style="min-width: fit-content; min-height: 70px;">
	{#if pokedexId > 0 && pokedexId <= $meta.lastPokedexEntry}
		<a
			href={`/pokemon/${pokedexId}${urlWithoutVariety()}`}
			onclick={() => {
				Logger.addPageAction('PokemonNavigation');
			}}
		>
			<Card
				classes="w-fit h-auto inline-flex"
				style="margin: 0; padding: 10px; min-height: 70px;"
				isClickable
			>
				<p class="m-auto hidden sm:block">#{pokedexId}</p>
				{#if iconUrl}
					<Image
						src={`${iconUrl}/${pokedexId}.png`}
						alt="icon"
						classNames="icon"
						loading="eager"
						width="50"
					/>
				{:else}
					<Image src="/placeholder.png" alt="icon" classNames="icon" loading="eager" />
				{/if}
			</Card>
		</a>
	{:else}
		<!-- svelte-ignore element_invalid_self_closing_tag -->
		<div class="w-[50px]" />
	{/if}
</div>
