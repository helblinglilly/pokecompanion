<script lang="ts">
	import GameSelector from '../../components/GameSelector.svelte';
	import {
		animateSprites,
		primaryLanguage,
		secondaryLanguage,
		versionSpecificSprites
	} from '$lib/domain';
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

<main>
	<h1 style="margin-bottom: 20px;">Settings</h1>

	<div class="columns">
		<div class="column">
			<div class="card">
				<GameSelector />
			</div>
		</div>

		<div class="column">
			<div class="card">
				<h3>Sprites</h3>
				<div class="mt-2">
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
				<div>
					<input
						on:change={() => {
							versionSpecificSprites.set(!$versionSpecificSprites);
						}}
						checked={$versionSpecificSprites}
						type="checkbox"
						id="gameSpecificSpritesInput"
						name="gameSpecificSprites"
					/>
					<label for="gameSpecificSpritesInput">Show game specific sprites when possible</label><br
					/>
				</div>
			</div>
		</div>
	</div>

	<h2>Language</h2>
	<div class="columns">
		<div class="column">
			<div class="card">
				<label for="primaryLanguageSelector"><h3>Primary Language</h3></label>
				<select
					bind:value={$primaryLanguage}
					on:change={(event) => {
						if (event.currentTarget.value) {
							typesafeSetPrimaryLanguage(event.currentTarget.value);
						}
					}}
					name="language"
					id="primaryLanguageSelector"
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
								{language.englishName} - {language.nativeName}
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
								{language.englishName} - {language.nativeName}
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
