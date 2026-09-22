<script lang="ts">
	import Greeting from '$/routes/Greeting.svelte';
	import SelfMarketing from './SelfMarketing.svelte';
	import SocialPreview from '$/lib/components/SocialPreview.svelte';
	import Card from '$/ui/atoms/Card.svelte';
	import PokemonCardEntry from '$/ui/molecules/pokemon/card/PokemonCardEntry.svelte';

	import MoveListEntry from '$/ui/molecules/move/list/MoveListEntry.svelte';

	let { data } = $props();
</script>

<SocialPreview previewImage={`https://socialpreviews.pokecompanion.helbling.uk/home.png`} />

<div class="home-page">
	<section>
		<Greeting />
	</section>

	<section>
		<div class="columns home-columns">
			<div class="column p-0">
				<h2 class="h2">A wild app appeared!</h2>
				<Card classes="app-promo-card h-full p-8 max-h-60 md:max-h-52">
					<p>Easy, sleek, and in your pocket. Try the Pokécompanion app today.</p>
					<a
						href="https://play.google.com/store/apps/details?id=com.helblinglilly.pokecompanion"
						aria-label="Get the Pokécompanion app on Google Play"
					>
						<img
							src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
							alt="Get it on Google Play"
						/>
					</a>
				</Card>
			</div>

			<div class="column p-0">
				<h2 class="h2">Pokémon of the day</h2>
				{#await data.data}
					<Card
						classes="of-the-day-loading pokemon-of-the-day-loading"
						ariaLabel="Loading Pokémon of the day"
					>
						<div class="pokemon-of-the-day-sprite-placeholder" aria-hidden="true"></div>
						<p>Loading...</p>
						<p aria-hidden="true">&nbsp;</p>
					</Card>
				{:then resolved}
					{#if resolved.ofTheDay.pokemon}
						<a href={resolved.ofTheDay.pokemon?.pokedex.pokedexSlug} class="no-underline">
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
					<Card
						classes="of-the-day-loading move-of-the-day-loading"
						ariaLabel="Loading move of the day"
					>
						<p>Loading...</p>
					</Card>
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
	.home-page {
		display: grid;
		gap: var(--space-4);
	}

	.home-columns {
		width: 100%;
		gap: var(--space-4);
	}

	h2 {
		padding-bottom: 0.5rem;
	}

	:global(.app-promo-card) {
		display: grid;
		gap: var(--space-3);
		align-content: center;
	}

	:global(.app-promo-card a) {
		display: inline-flex;
		width: fit-content;
		justify-self: center;
	}

	:global(.app-promo-card img) {
		display: block;
		width: 10.5rem;
		height: auto;
	}

	:global(.of-the-day-loading) {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:global(.pokemon-of-the-day-loading) {
		display: block;
		padding: 2rem;
		text-align: center;
	}

	.pokemon-of-the-day-sprite-placeholder {
		height: 96px;
		width: 96px;
		margin-right: auto;
		margin-left: auto;
	}

	:global(.move-of-the-day-loading) {
		height: 7rem;
		padding: 2rem;
	}
</style>
