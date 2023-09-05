<script lang="ts">
	import GameSelector from '../../components/GameSelector.svelte';
	import { primaryLanguage, secondaryLanguage, theme } from '$lib/domain';
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

<h1 style="margin-bottom: 20px;">Settings</h1>

<main>
	<div class="columns">
		<div class="column">
			<div class="card">
				<GameSelector />
			</div>
		</div>

		<div class="column">
			<div class="card">
				<label for="theme"><h3>Theme</h3></label>
				<select bind:value={$theme} name="theme" id="themeSelector">
					<option value="dark">Dark</option>
					<option value="light">Light</option></select
				>
			</div>
		</div>
	</div>

	<div class="columns">
		<div class="column">
			<div class="card">
				<label for="language"><h3>Language</h3></label>
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
				<label for="secondaryLanguage"><h3>Secondary Language</h3></label>
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
