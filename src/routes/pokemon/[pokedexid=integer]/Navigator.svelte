<script lang="ts">
	import type { APIPokemon } from '$/@types/api.pokecompanion';
	import Select from '$/ui/atoms/select/Select.svelte';
	import { goto } from '$app/navigation';
	import { Logger } from '$/debt/log';
	import NavigationButton from './NavigationButton.svelte';
	import { page } from '$app/stores';

	export let title: string;
	export let currentId: number;
	export let varieties: APIPokemon['varieties'];
	const varietyParam = $page.url.searchParams.get('variety');

	$: innerWidth = 750;
</script>

<svelte:window bind:innerWidth />

<div class="grid gap-2">
	{#if innerWidth < 450}
		<div class="w-full grid gap-2">
			<div class="inline-flex w-full justify-between gap-4">
				<NavigationButton pokedexId={currentId - 1} />
				<h2 class="h2 my-auto">#{currentId}</h2>
				<NavigationButton pokedexId={currentId + 1} />
			</div>
			<h1 class="h2 text-center">{title}</h1>
		</div>
	{:else}
		<div class="w-full inline-flex justify-between gap-2">
			<NavigationButton pokedexId={currentId - 1} />
			<h1 class="h2 my-auto text-center">#{currentId} {title}</h1>
			<NavigationButton pokedexId={currentId + 1} />
		</div>
	{/if}

	{#if varieties.length > 1}
		<div class="w-full flex justify-center">
			<Select
				value={varieties.find((a) => (varietyParam ? a.name === varietyParam : a.isDefault))?.name}
				options={varieties.map((variety) => ({
					label: variety.displayName,
					value: variety.name
				}))}
				style="width: 100%; padding-left: 1rem; padding-right: 1rem; margin: 0; text-align: center;"
				on:change={({ detail }) => {
					Logger.addPageAction('Variety');

					const newTargetVariety = varieties.find((variety) => variety.name === detail);
					if (!newTargetVariety) {
						console.error('Could not find the same variety again as the one that got changed to');
						return;
					}
					goto(newTargetVariety.pokecompanionUrl);
				}}
			/>
		</div>
	{/if}
</div>
