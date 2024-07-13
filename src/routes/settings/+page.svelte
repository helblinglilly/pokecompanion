<script lang="ts">
	import VersionGroupSelector from '$/components/GameSelectors/VersionGroupSelector';
	import SocialPreview from '$/components/SocialPreview.svelte';
	import Card from '$/ui/atoms/card/Card.svelte';
	import Select from '$/ui/atoms/select/Select.svelte';
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
			name: 'English',
			flag: '🇬🇧'
		},
		{
			code: 'de',
			name: 'German - Deutsch',
			flag: '🇩🇪'
		},
		{
			code: 'ja-Hrkt',
			name: 'Japanese - 日本語',
			flag: '🇯🇵'
		},
		{
			code: 'zh-Hant',
			name: 'Chinese - 中国人',
			flag: '🇨🇳'
		},
		{
			code: 'fr',
			name: 'French - Français',
			flag: '🇫🇷'
		},
		{
			code: 'it',
			name: 'Italian - Italiano',
			flag: '🇮🇹'
		},
		{
			code: 'es',
			name: 'Spanish - Español',
			flag: '🇪🇸'
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
			<Card>
				<label for="gameSelector"><h3 class="h3">Selected Game</h3></label>
				<VersionGroupSelector
					versionGroups={GameGroups}
					onChange={(newValue) => selectedGame.set(getGameGroupFromName(newValue))}
					showGenericOption={true}
					currentlySelected={$selectedGame?.pokeapi}
				/>
			</Card>
		</div>

		<div class="column">
			<Card>
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
			</Card>
		</div>
	</div>

	<h2 class="h2">Language</h2>
	<div class="columns">
		<div class="column">
			<Card>
				<label for="primaryLanguageSelector"><h3 class="h3">Primary Language</h3></label>

				<Select
					options={languages.map((lang) => ({
						label: lang.flag + ' ' + lang.name,
						value: lang.code,
						disabled: $secondaryLanguage === lang.code
					}))}
					bind:value={$primaryLanguage}
				/>
			</Card>
		</div>

		<div class="column">
			<Card>
				<label for="secondaryLanguageSelector"><h3 class="h3">Secondary Language</h3></label>
				<Select
					options={languages.map((lang) => ({
						label: lang.flag + ' ' + lang.name,
						value: lang.code,
						disabled: $primaryLanguage === lang.code
					}))}
					bind:value={$secondaryLanguage}
				/>
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
