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
			classes="variety-select"
			onchange={(detail) => {
				const currentUrl = new URL(page.url);

				const newTargetVariety = varieties.find((variety) => variety.name === detail);
				if (!newTargetVariety) {
					console.error('Could not find the same variety again as the one that got changed to');
					return;
				}

				currentUrl.searchParams.set('variety', detail);
				goto(currentUrl, { invalidateAll: true, noScroll: true, keepFocus: false });
			}}
		/>
	</div>
{/if}

<style>
	:global(.variety-select) {
		width: 100%;
		margin: 0;
		padding-right: var(--space-3);
		padding-left: var(--space-3);
		text-align: center;
	}
</style>
