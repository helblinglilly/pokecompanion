<script lang="ts">
	import Select from '$/ui/atoms/select/Select.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Logger } from '$lib/log';
	import { pokemonDisplayStore } from '$lib/stores/pokemonPage';
	import { capitaliseFirstLetter } from '$lib/utils/string';
	import NavigationButton from './NavigationButton.svelte';

	export let title: string;
	export let currentId: number;
	export let forms: { name: string }[];

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

	{#if forms.length > 1}
		<div class="w-full flex justify-center">
			<Select
				value={$pokemonDisplayStore.variety}
				options={forms.map((form) => ({
					label: form.name
						.split('-')
						.splice(1)
						.map((a) => capitaliseFirstLetter(a))
						.join(' '),
					value: form.name
				}))}
				style="width: 100%; padding-left: 1rem; padding-right: 1rem; margin: 0; text-align: center;"
				on:change={({ detail }) => {
					Logger.addPageAction('UIInteraction', 'Variety', {
						action: 'Navigation'
					});

					const newUrl = new URL($page.url);

					if (detail.endsWith('-default')) {
						newUrl.searchParams.delete('variety');
						goto(newUrl.toString());
					} else {
						newUrl.searchParams.set('variety', detail);
						goto(newUrl.toString());
					}
				}}
			/>
		</div>
	{/if}
</div>
