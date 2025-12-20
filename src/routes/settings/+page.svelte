<script lang="ts">
	import SocialPreview from '$/lib/components/SocialPreview.svelte';
	import Card from '$/ui/atoms/card/Card.svelte';
	import Select from '$/ui/atoms/select/Select.svelte';
	import { GameGroups, PokeapiVersionNames } from '$/debt/games';
	import {
		animateSprites,
		meta,
		primaryLanguage,
		secondaryLanguage,
		selectedGame,
		versionSpecificPokemonSprites,
		versionSpecificTypeSprites
	} from '$lib/stores/domain';

	export let data;
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<SocialPreview
	title="Settings"
	previewImage="https://socialpreviews.pokecompanion.helbling.uk/settings.png"
/>

<main>
	<h1 class="h1" style="margin-bottom: 20px;">Settings</h1>

	<div class="columns">
		<div class="column mb-4 md:mr-4">
			<Card classes="h-full pl-8 pr-8">
				<label for="gameSelector"><h3 class="h3">Selected Game</h3></label>

				<Select
					isNested
					options={GameGroups.map((gameGroup) => ({
						label: gameGroup.shortName,
						value: gameGroup.pokeapi
					}))}
					value={$selectedGame ? $selectedGame.pokeapi : PokeapiVersionNames.HOME}
					on:change={({ detail }) => {
						const game = $meta.games.find((metaGame) => metaGame.pokeapi === detail);
						if (game) {
							selectedGame.set(game);
						}
					}}
				/>
				{#if !$selectedGame}
					<p>This will show default sprites.</p>
					<p>You will need to select a game whenever game-specific information is available.</p>
				{:else if $selectedGame.pokeapi === 'home'}
					<p>
						This option will not display any game-specific information but Pokémon Home sprites will
						be displayed.
					</p>
				{:else}
					<p>{$selectedGame.region} Region</p>
					<p>
						{$selectedGame.generation.name}, including Pokémon up to #{$selectedGame.generation
							.nationalDexEnd} in the National Pokédex
					</p>
				{/if}
			</Card>
		</div>

		<div class="column mb-4 md:ml-4">
			<Card classes="h-full pl-8 pr-8">
				<label for="animateSprites"> <h3 class="h3 mb-4">Sprites</h3></label>

				<div class="input-group">
					<input
						on:change={() => {
							animateSprites.set(!$animateSprites);
						}}
						checked={$animateSprites}
						type="checkbox"
						id="animateSpritesInput"
						name="animateSprites"
					/>
					<label for="animateSpritesInput">Animate sprites where possible</label>
				</div>

				<div class="input-group">
					<input
						on:change={() => {
							if ($versionSpecificPokemonSprites && $versionSpecificTypeSprites) {
								versionSpecificPokemonSprites.set(false);
								versionSpecificTypeSprites.set(false);
							} else {
								versionSpecificPokemonSprites.set(true);
								versionSpecificTypeSprites.set(true);
							}
						}}
						checked={$versionSpecificPokemonSprites && $versionSpecificTypeSprites}
						type="checkbox"
						id="gameSpecificSprites"
						name="gameSpecificSprites"
					/>
					<label for="gameSpecificSprites">Show game specific sprites when possible</label>
				</div>

				<div class="input-group ml-8">
					<input
						on:change={() => {
							versionSpecificPokemonSprites.set(!$versionSpecificPokemonSprites);
						}}
						checked={$versionSpecificPokemonSprites}
						type="checkbox"
						id="gameSpecificSpritesInput"
						name="gameSpecificPokemonSprites"
					/>
					<label for="gameSpecificSpritesInput">Pokemon</label>
				</div>

				<div class="input-group ml-8">
					<input
						on:change={() => {
							versionSpecificTypeSprites.set(!$versionSpecificTypeSprites);
						}}
						checked={$versionSpecificTypeSprites}
						type="checkbox"
						id="gameSpecificTypeSpritesInput"
						name="gameSpecificTypeSprites"
					/>
					<label for="gameSpecificTypeSpritesInput">Icons</label>
				</div>
			</Card>
		</div>
	</div>

	<h2 class="h2 pb-4">Language</h2>
	<p />
	<div class="columns">
		<div class="column pb-4 md:mr-4">
			<Card classes="h-full pl-8 pr-8">
				<label for="primaryLanguageSelector"><h3 class="h3">Primary Language</h3></label>

				<Select
					isNested
					options={(data.languages ?? []).map((lang) => ({
						label: lang.flag + ' ' + lang.name,
						value: lang.code,
						disabled: $secondaryLanguage === lang.code
					}))}
					bind:value={$primaryLanguage}
				/>
				<p>This will change the language of any data, not the site.</p>
			</Card>
		</div>

		<div class="column pb-4 md:ml-4">
			<Card classes="h-full pl-8 pr-8">
				<label for="secondaryLanguageSelector"><h3 class="h3">Secondary Language</h3></label>
				<Select
					isNested
					options={[{ label: '🏳️ None', value: 'none' }].concat(
						(data.languages ?? []).map((lang) => ({
							label: lang.flag + ' ' + lang.name,
							value: lang.code,
							disabled: $primaryLanguage === lang.code
						}))
					)}
					bind:value={$secondaryLanguage}
				/>
				{#if !$secondaryLanguage}
					<p>You can add another language if you wish</p>
				{:else}
					<p>You can search in either language. To disable, select "None".</p>
				{/if}
			</Card>
		</div>
	</div>
</main>

<style>
	.input-group {
		display: flex;
		margin-bottom: 10px;
		align-items: baseline;
	}

	/* Issue where the label doesn't wrap :( */
	@media screen and (max-width: 500px) {
		.input-group {
			max-width: 250px;
		}
	}
</style>
