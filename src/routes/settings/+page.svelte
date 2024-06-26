<script lang="ts">
	import VersionGroupSelector from '$/components/GameSelectors/VersionGroupSelector';
	import SocialPreview from '$/components/SocialPreview.svelte';
	import { GameGroups, getGameGroupFromName } from '$lib/data/games';
	import {
		animateSprites,
		primaryLanguage,
		secondaryLanguage,
		selectedGame,
		versionSpecificPokemonSprites,
		versionSpecificTypeSprites
	} from '$lib/stores/domain';
	import type { Languages } from '$lib/utils/language';

	const languages = [
		{
			code: 'en',
			englishName: 'English'
		},
		{
			code: 'de',
			englishName: 'German',
			nativeName: 'Deutsch'
		},
		{
			code: 'ja-Hrkt',
			englishName: 'Japanese',
			nativeName: '日本語'
		},
		{
			code: 'zh-Hant',
			englishName: 'Chinese',
			nativeName: '中国人'
		},
		{
			code: 'fr',
			englishName: 'French',
			nativeName: 'Français'
		},
		{
			code: 'it',
			englishName: 'Italian',
			nativeName: 'Italiano'
		},
		{
			// Spanish data is not correct
			code: 'es',
			englishName: 'Spanish',
			nativeName: 'Español'
		}
	];

	const getMinimalClassName = (criteria: Array<string | undefined>) => {
		return criteria.filter((result) => result !== undefined).join(' ');
	};

	const typesafeSetPrimaryLanguage = (newVal: string) => {
		primaryLanguage.set(newVal as unknown as keyof Languages);
	};
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
		<div class="column">
			<div class="card">
				<label for="gameSelector"><h3 class="h3">Selected Game</h3></label>
				<VersionGroupSelector
					versionGroups={GameGroups}
					onChange={(newValue) => selectedGame.set(getGameGroupFromName(newValue))}
					showGenericOption={true}
					currentlySelected={$selectedGame?.pokeapi}
				/>
			</div>
		</div>

		<div class="column">
			<div class="card">
				<h3 class="h3">Sprites</h3>
				<div class="input-group">
					<input
						on:change={() => {
							animateSprites.set(!$animateSprites);
						}}
						checked={$animateSprites}
						type="checkbox"
						id="animateSpritesInput"
						name="animateSprites"
						style="margin-right: 10px;"
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
						style="margin-right: 10px;"
					/>
					<label for="gameSpecificSprites">Show game specific sprites when possible</label>
				</div>

				<div class="input-group ml-6">
					<input
						on:change={() => {
							versionSpecificPokemonSprites.set(!$versionSpecificPokemonSprites);
						}}
						checked={$versionSpecificPokemonSprites}
						type="checkbox"
						id="gameSpecificSpritesInput"
						name="gameSpecificPokemonSprites"
						style="margin-right: 10px;"
					/>
					<label for="gameSpecificSpritesInput">Pokemon</label>
				</div>

				<div class="input-group ml-6">
					<input
						on:change={() => {
							versionSpecificTypeSprites.set(!$versionSpecificTypeSprites);
						}}
						checked={$versionSpecificTypeSprites}
						type="checkbox"
						id="gameSpecificTypeSpritesInput"
						name="gameSpecificTypeSprites"
						style="margin-right: 10px;"
					/>
					<label for="gameSpecificTypeSpritesInput">Icons</label>
				</div>
			</div>
		</div>
	</div>

	<h2 class="h2">Language</h2>
	<div class="columns">
		<div class="column">
			<div class="card">
				<label for="primaryLanguageSelector"><h3 class="h3">Primary Language</h3></label>
				<select
					bind:value={$primaryLanguage}
					on:change={(event) => {
						if (event.currentTarget.value) {
							typesafeSetPrimaryLanguage(event.currentTarget.value);
						}
					}}
					name="language"
					id="primaryLanguageSelector"
					class="pl-4"
				>
					{#each languages as language}
						<option
							value={language.code}
							class={getMinimalClassName([
								$primaryLanguage === language.code ? 'selected' : undefined,
								language.code === $secondaryLanguage ? 'disabled' : undefined
							])}
							disabled={language.code === $secondaryLanguage}
						>
							{#if language.nativeName}
								{`${language.englishName} - ${language.nativeName}`}
							{:else}
								{language.englishName}
							{/if}
						</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="column">
			<div class="card">
				<label for="secondaryLanguageSelector"><h3>Secondary Language</h3></label>
				<select
					bind:value={$secondaryLanguage}
					name="secondaryLanguage"
					id="secondaryLanguageSelector"
					class="pl-4"
				>
					<option value={'none'} class={$secondaryLanguage === 'none' ? 'selected' : undefined}
						>None</option
					>
					{#each languages as language}
						<option
							value={language.code}
							class={getMinimalClassName([
								$secondaryLanguage === language.code ? 'selected' : undefined,
								language.code === $primaryLanguage ? 'disabled' : undefined
							])}
							disabled={language.code === $primaryLanguage}
						>
							{#if language.nativeName}
								{`${language.englishName} - ${language.nativeName}`}
							{:else}
								{language.englishName}
							{/if}
						</option>
					{/each}
				</select>
			</div>
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
