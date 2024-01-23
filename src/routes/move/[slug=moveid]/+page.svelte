<script lang="ts">
	import { primaryLanguage, secondaryLanguage, selectedGame } from '$lib/stores/domain';
	import { getNameEntries, joinNameEntries } from '$lib/utils/language';

	export let data;

	$: primaryFlavourText = data.move.flavor_text_entries.find((entry) => {
		if ($selectedGame) {
			return (
				entry.language.name === $primaryLanguage &&
				entry.version_group.name === $selectedGame.pokeapiVersionGroup
			);
		}
		return entry.language.name === $primaryLanguage;
	});

	$: secondaryFlavourText = data.move.flavor_text_entries.find((entry) => {
		if ($selectedGame) {
			return (
				entry.language.name === $secondaryLanguage &&
				entry.version_group.name === $selectedGame.pokeapiVersionGroup
			);
		}
		return entry.language.name === $secondaryLanguage;
	});
</script>

<h1>
	{joinNameEntries(getNameEntries(data.move.names, $primaryLanguage, $secondaryLanguage), '-')}
</h1>

<div class="card">
	{#if primaryFlavourText}
		<h3>{primaryFlavourText?.flavor_text}</h3>
	{/if}
	{#if secondaryFlavourText}
		<h3>{secondaryFlavourText?.flavor_text}</h3>
	{/if}
</div>
