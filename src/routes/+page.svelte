<script lang="ts">
	import Greeting from '$components/Homepage/Greeting.svelte';
	import SelfMarketing from '$components/Homepage/SelfMarketing.svelte';
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
	<title>Pokécompanion</title>
	<meta property="og:image" content={`/socialpreview/home.png`} />
	<meta name="twitter:image" content={`/socialpreview/home.png`} />
</svelte:head>

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
		/>
	</div>
</div>

<style src="./home.css"></style>
