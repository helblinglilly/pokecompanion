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
</script>

<div class="grid gap-2">
	<div class="flex justify-between" style="margin-bottom: 0; padding-bottom: 0;">
		<div class="max-w-fit contents">
			<NavigationButton pokedexId={currentId - 1} />
		</div>

		<div class="grid items-center max-w-fit gap-4">
			<h1 class={`h2 grid ${forms.length > 1 ? 'mt-4' : 'my-auto'} pb-0 text-center`}>
				#{currentId}
				{title}
			</h1>

			{#if forms.length > 1}
				<Select
					value={$pokemonDisplayStore.variety}
					options={forms.map((form) => ({
						label: capitaliseFirstLetter(form.name.split('-').splice(1).join(' ')),
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
			{/if}
		</div>

		<div
			class="justify-end contents max-w-fit"
			style="justify-content: end; display: contents; max-width: fit-content;"
		>
			<NavigationButton pokedexId={currentId + 1} />
		</div>
	</div>
</div>
