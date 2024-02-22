<script lang="ts">
	import Greeting from '$components/Homepage/Greeting.svelte';
	import SelfMarketing from '$components/Homepage/SelfMarketing.svelte';
	import SocialPreview from '$components/SocialPreview.svelte';
	import PokemonCardEntry from '$components/Tags/PokemonCardEntry.svelte';
	import { lastPokedexEntry } from '$lib/stores/domain';
	import { daysPassedInYear, randomDailyNumber } from '$lib/utils/number';

	// import { homepageMessaging } from '$lib/stores/domain';

	const pokemonOtdId = randomDailyNumber(lastPokedexEntry)[daysPassedInYear()];
	const featuredPokemon = {
		id: randomDailyNumber(lastPokedexEntry)[daysPassedInYear()],
		// 1% chance to show a shiny.
		// Zacian is the first Pokemon to have been shiny locked - no shiny exists
		shiny: Math.random() < 0.01 && pokemonOtdId < 888
	};
</script>

<svelte:head>
	<link rel="stylesheet" href="styles/home.css" />
</svelte:head>

<SocialPreview title="Homepage" />

<!-- {#if $homepageMessaging === 'new-visitor' || !$homepageMessaging} -->
<Greeting mode="new" />
<SelfMarketing />
<!-- {/if} -->

<div class="columns">
	<div class="column" id="pokemonOTDWrapper">
		<h2 class="h2">Pokémon of the day</h2>
		<PokemonCardEntry
			pokemon={featuredPokemon}
			showRemoveButton={false}
			showGenderAndShiny={false}
			style="max-width: 100%; margin: 0;"
		/>
	</div>
	<div class="column" />
	<div class="column" />
</div>

<style src="./home.css"></style>
