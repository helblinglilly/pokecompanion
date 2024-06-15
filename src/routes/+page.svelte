<script lang="ts">
	import Greeting from '$/components/Homepage/Greeting.svelte';
	import PokemonOtd from '$/components/Homepage/PokemonOTD.svelte';
	import SelfMarketing from '$/components/Homepage/SelfMarketing.svelte';
	import SocialPreview from '$/components/SocialPreview.svelte';
	import MoveCardEntry from '$/components/Tags/MoveCardEntry.svelte';
	import MoveListEntry from '$/components/Tags/MoveListEntry.svelte';
	import PokemonCardEntry from '$/components/Tags/PokemonCardEntry.svelte';
	import Moves from '$/lib/data/moves.json';
	import { Logger } from '$lib/log';
	import { lastPokedexEntry } from '$lib/stores/domain';
	import { daysPassedInYear, randomDailyNumber } from '$lib/utils/number';
	import { onMount } from 'svelte';

	// import { homepageMessaging } from '$lib/stores/domain';
	const pokemonOtdId = randomDailyNumber(lastPokedexEntry)[daysPassedInYear()];
	const featuredPokemon = {
		id: pokemonOtdId,
		// 1% chance to show a shiny.
		// Zacian is the first Pokemon to have been shiny locked - no shiny exists
		shiny: Math.random() < 0.01 && pokemonOtdId < 888
	};

	const moveOtdIndex = randomDailyNumber(Moves.length)[daysPassedInYear()];

	onMount(async () => {
		Logger.addPageAction('PokemonOTD', pokemonOtdId.toString(), {
			isShiny: featuredPokemon.shiny
		});
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="styles/home.css" />
</svelte:head>

<SocialPreview previewImage={`https://socialpreviews.pokecompanion.helbling.uk/home.png`} />

<!-- {#if $homepageMessaging === 'new-visitor' || !$homepageMessaging} -->
<Greeting mode="new" />
<SelfMarketing />
<!-- {/if} -->

<div class="columns pb-8 w-full">
	<div class="column otdWrapper">
		<h2 class="h2">Pokémon of the day</h2>
		<PokemonOtd
			pokemon={{ ...featuredPokemon, added: new Date().toISOString() }}
			style="margin: 0; padding: 0;"
		/>
	</div>
	<div class="column otdWrapper">
		<h2 class="h2 m-0">Move of the day</h2>
		<MoveListEntry id={Moves[moveOtdIndex].id} showRemoveButton={false} />
	</div>
	<div class="column" />
</div>

<style src="./home.css"></style>
