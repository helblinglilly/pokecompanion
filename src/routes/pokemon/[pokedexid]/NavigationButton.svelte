<script lang="ts">
	import { Logger } from '$/lib/log';
	import { lastPokedexEntry } from '$/lib/stores/domain';
	import { pokemonDisplayStore } from '$/lib/stores/pokemonPage';
	import Card from '$/ui/atoms/card';
	import Image from '$/ui/atoms/image/Image.svelte';

	export let pokedexId: number;

	const iconUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
</script>

<div style="min-width: 90px; min-height: 70px;">
	{#if pokedexId > 0 && pokedexId < lastPokedexEntry}
		<a
			href={`/pokemon/${pokedexId}${
				$pokemonDisplayStore.transferableQueryParams.length > 0
					? `${$pokemonDisplayStore.transferableQueryParams}`
					: ''
			}`}
			on:click={() => {
				Logger.addPageAction('UIInteraction', 'PokemonNavigation', {
					action: 'Navigation'
				});
			}}
		>
			<Card classes="w-fit h-auto inline-flex" style="margin: 0; padding: 10px;" isClickable>
				<p style="margin: auto;">#{pokedexId}</p>
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
	{/if}
</div>
