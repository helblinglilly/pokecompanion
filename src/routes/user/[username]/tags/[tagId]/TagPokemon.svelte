<script lang="ts">
	import { getPokemonEntry } from '$/lib/data/games';
	import { primaryLanguage, secondaryLanguage } from '$/lib/stores/domain';
	import type { TagRecord } from '$/lib/types/ITags';
	import { getMultiLanguageName } from '$/lib/utils/language';
	import { termNormaliser } from '$/lib/utils/string';
	import { getContext } from 'svelte';
	import { type Writable } from 'svelte/store';
	export let filterTerm: string;

	const tag = getContext('tag') as Writable<TagRecord>;

	const pokemon = $tag.contents.pokemon?.filter((mon) => {
		const normalised = termNormaliser(filterTerm);
		const matchesId = `${mon.id}`.includes(filterTerm);
		const names = termNormaliser(
			getMultiLanguageName(
				getPokemonEntry(mon.id).names,
				$primaryLanguage,
				$secondaryLanguage,
				mon.variety ?? ''
			) ?? ''
		);

		const matchesName = names.includes(normalised);
		return matchesId || matchesName;
	});
</script>

{#if !pokemon || pokemon.length === 0}
	<p>No Pokemon</p>
{:else}{/if}
