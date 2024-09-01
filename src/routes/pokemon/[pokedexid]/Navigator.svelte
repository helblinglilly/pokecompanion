<script lang="ts">
	import Select from '$/ui/atoms/select/Select.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Logger } from '$lib/log';
	import { pokemonDisplayStore } from '$lib/stores/pokemonPage';
	import { capitaliseFirstLetter } from '$lib/utils/string';
	import { get } from 'svelte/store';
	import NavigationButton from './NavigationButton.svelte';

	export let title: string;
	export let currentId: number;
	export let forms: { name: string }[];
</script>

<div class="columns mobile justify-between">
	<div class="column max-w-fit contents">
		<NavigationButton pokedexId={currentId - 1} />
	</div>

	<div class="column grid md:inline-flex items-center max-w-fit px-2">
		<h1 class="h2 min-w-fit mt-auto mb-auto pb-0 text-center">
			<span class="md:hidden">
				#{currentId}
			</span>

			<span class="hidden md:inline-flex">
				{title}
			</span>
		</h1>
		{#if forms.length > 1}
			<Select
				value={$pokemonDisplayStore.variety}
				options={forms.map((form) => ({
					label: capitaliseFirstLetter(form.name.split('-').splice(1).join(' ')),
					value: form.name
				}))}
				style="max-width: fit-content; padding: 1rem; margin: 0;"
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
		{/if}
	</div>

	<div
		class="column justify-end contents max-w-fit"
		style="justify-content: end; display: contents; max-width: fit-content;"
	>
		<NavigationButton pokedexId={currentId + 1} />
	</div>
</div>
