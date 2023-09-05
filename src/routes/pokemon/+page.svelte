<script>
	import { primaryLanguage, secondaryLanguage } from '$lib/domain';
	import { getMultiLanguageName } from '$lib/utils/language';
	import PokemonPreview from '../../components/PokemonPreview.svelte';

	export let data;
</script>

{#each data.gen1 as pokemon}
	<PokemonPreview {pokemon} />
{/each}
