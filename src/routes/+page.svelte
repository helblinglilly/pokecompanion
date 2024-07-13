<script lang="ts">
	import VersionGroupSelector from '$/components/GameSelectors/VersionGroupSelector';
	import Greeting from '$/components/Homepage/Greeting.svelte';
	import MoveOtd from '$/components/Homepage/MoveOTD.svelte';
	import PokemonOtd from '$/components/Homepage/PokemonOTD.svelte';
	import SelfMarketing from '$/components/Homepage/SelfMarketing.svelte';
	import SocialPreview from '$/components/SocialPreview.svelte';
	import { GameGroups, getGameGroupFromName } from '$/lib/data/games';
	import Moves from '$/lib/data/moves.json';
	import Card from '$/ui/atoms/card/Card.svelte';
	import Select from '$/ui/atoms/select';
	import { Logger } from '$lib/log';
	import { lastPokedexEntry, selectedGame } from '$lib/stores/domain';
	import { daysPassedInYear, randomDailyNumber } from '$lib/utils/number';
	import { onMount } from 'svelte';

	const pokemonOtdId = randomDailyNumber(lastPokedexEntry)[daysPassedInYear()];

	const moveOtdIndex = randomDailyNumber(Moves.length)[daysPassedInYear()];

	onMount(async () => {
		Logger.addPageAction('PokemonOTD', pokemonOtdId.toString());
		Logger.addPageAction('MoveOTD', moveOtdIndex.toString());
	});

	/**
	 * Styling:
	 * Tailwind will take a while to load and apply, especially on slower network
	 * conntections
	 *
	 * Styling elements that affect the layout have been done inline to avoid
	 * layout shift as the site/assets load in
	 *
	 */
</script>

<SocialPreview previewImage={`https://socialpreviews.pokecompanion.helbling.uk/home.png`} />

<div style="display: grid; gap: 1rem;">
	<section>
		<Greeting />
	</section>

	<hr
		class="desktop-only"
		style="border-color: var(--text); height: 0.2rem; margin-top: 0.2rem; margin-bottom: 0.2rem;"
	/>

	<section>
		<div class="columns" style="width: 100%; gap: 1rem;">
			<div class="column p-0">
				<h2 class="h2">Which game are you playing?</h2>
				<Card style="max-height: 12rem;">
					<div>
						<p>You can change this later in settings</p>

						<VersionGroupSelector
							versionGroups={GameGroups}
							onChange={(newValue) => selectedGame.set(getGameGroupFromName(newValue))}
							showGenericOption={false}
							currentlySelected={$selectedGame?.pokeapi}
						/>
					</div>
				</Card>
			</div>

			<div class="column p-0">
				<h2 class="h2">Pokémon of the day</h2>
				<PokemonOtd pokemon={pokemonOtdId} />
			</div>
			<div class="column p-0">
				<h2 class="h2">Move of the day</h2>
				<MoveOtd id={Moves[moveOtdIndex].id} />
			</div>
		</div>
	</section>

	<section>
		<SelfMarketing />
	</section>
</div>
