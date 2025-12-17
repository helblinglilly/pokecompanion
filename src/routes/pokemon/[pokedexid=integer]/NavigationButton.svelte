<script lang="ts">
	import { Logger } from '$/debt/log';
	import { meta } from '$/lib/stores/domain';
	import { pokemonDisplayStore } from '$/lib/stores/pokemonPage';
	import Card from '$/ui/atoms/card';
	import Image from '$/ui/atoms/image/Image.svelte';

	export let pokedexId: number;

	const iconUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
</script>

<div style="min-width: fit-content; min-height: 70px;">
	{#if pokedexId > 0 && pokedexId <= $meta.lastPokedexEntry}
		<a
			href={`/pokemon/${pokedexId}${
				$pokemonDisplayStore.transferableQueryParams.length > 0
					? `${$pokemonDisplayStore.transferableQueryParams}`
					: ''
			}`}
			on:click={() => {
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
		<div class="w-[50px]" />
	{/if}
</div>
