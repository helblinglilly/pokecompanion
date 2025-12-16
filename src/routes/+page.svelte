<script lang="ts">
	import Greeting from '$/routes/Greeting.svelte';
	import SelfMarketing from './SelfMarketing.svelte';
	import SocialPreview from '$/lib/components/SocialPreview.svelte';
	import { getGameGroupFromName } from '$/lib/data/games';
	import Card from '$/ui/atoms/card/Card.svelte';
	import Select from '$/ui/atoms/select';
	import { selectedGame } from '$lib/stores/domain';
	import PokemonCardEntry from '$/ui/molecules/pokemon/card/PokemonCardEntry.svelte';
	import { invalidate } from '$app/navigation';
	import MoveListEntry from '$/ui/molecules/move/list/MoveListEntry.svelte';
	export let data;

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

<div style="display: grid; gap: 2rem;">
	<section>
		<Greeting />
	</section>

	<hr
		class="desktop-only"
		style="border-color: var(--text); height: 0.2rem; margin-top: 0.2rem; margin-bottom: 0.2rem;"
	/>

	<section>
		<div class="columns" style="width: 100%; gap: 2rem;">
			<div class="column p-0">
				<h2 class="h2">What you playing?</h2>
				<Card classes="h-full p-8 max-h-60 md:max-h-52">
					<p>You can change this later in settings</p>
					<Select
						isNested
						options={data.games.map((game) => ({
							label: game.shortName,
							value: game.pokeapi
						}))}
						value={$selectedGame
							? $selectedGame.pokeapi
							: data.games[data.games.length - 1]?.pokeapi}
						on:change={async ({ detail }) => {
							selectedGame.set(getGameGroupFromName(detail));
							await invalidate('selectedGame');
						}}
					/>

					{#if $selectedGame && $selectedGame?.pokeapi !== 'home'}
						<p class="mb-4">{$selectedGame.region} Region</p>
					{/if}
				</Card>
			</div>

			<div class="column p-0">
				<h2 class="h2">Pokémon of the day</h2>
				{#await data.data}
					<p>Loading...</p>
				{:then resolved}
					{#if resolved.ofTheDay.pokemon}
						<a href={resolved.ofTheDay.pokemon?.slug} class="no-underline">
							<PokemonCardEntry
								pokemon={resolved.ofTheDay.pokemon}
								shiny={false}
								showGenderAndShiny={false}
								isClickable={true}
								gender={undefined}
							/>
						</a>
					{:else}
						<p>No Pokémon available</p>
					{/if}
				{/await}
			</div>
			<div class="column p-0">
				<h2 class="h2">Move of the day</h2>
				{#await data.data}
					<p>Loading...</p>
				{:then resolved}
					{#if resolved.ofTheDay.move}
						<a href={resolved.ofTheDay.move?.slug} class="no-underline">
							<MoveListEntry move={resolved.ofTheDay.move} />
						</a>
					{:else}
						<p>No Move available</p>
					{/if}
				{/await}
			</div>
		</div>
	</section>

	<section>
		<SelfMarketing />
	</section>
</div>

<style>
	h2 {
		padding-bottom: 0.5rem;
	}
</style>
