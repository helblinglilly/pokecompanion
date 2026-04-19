<script lang="ts">
	import type { APIPokemon } from '$/@types/api.pokecompanion';
	import Select from '$/ui/atoms/Select.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	const {
		varieties,
		classes
	}: {
		varieties: APIPokemon['varieties'];
		classes?: string;
	} = $props();

	const varietyParam = $derived(page.url.searchParams.get('variety'));
</script>

{#if varieties.length > 1}
	<div class={`w-full flex justify-center md:min-w-32 ${classes}`}>
		<Select
			value={varieties.find((a) => (varietyParam ? a.name === varietyParam : a.isDefault))?.name}
			options={varieties.map((variety) => ({
				label: variety.displayName,
				value: variety.name
			}))}
			style="width: 100%; padding-left: 1rem; padding-right: 1rem; margin: 0; text-align: center;"
			onchange={(detail) => {
				const currentUrl = new URL(page.url);

				const newTargetVariety = varieties.find((variety) => variety.name === detail);
				if (!newTargetVariety) {
					console.error('Could not find the same variety again as the one that got changed to');
					return;
				}

				currentUrl.searchParams.set('variety', detail);
				goto(currentUrl);
			}}
		/>
	</div>
{/if}
