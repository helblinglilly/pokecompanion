<script lang="ts">
	import type { APIPokemon } from '$/@types/api.pokecompanion';
	import Select from '$/ui/atoms/Select.svelte';
	import { goto } from '$app/navigation';
	import NavigationButton from './NavigationButton.svelte';
	import { page } from '$app/state';
	import VarietySelector from '$/features/pokedex/pokemon/VarietySelector.svelte';

	interface Props {
		title: string;
		currentId: number;
		varieties: APIPokemon['varieties'];
	}

	let { title, currentId, varieties }: Props = $props();
	const varietyParam = $derived(page.url.searchParams.get('variety'));

	let innerWidth = $state(750);
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

	<VarietySelector {varieties} />
</div>
