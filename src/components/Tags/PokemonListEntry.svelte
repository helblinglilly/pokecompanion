<script lang="ts">
	import Image from '$components/Image.svelte';
	import { getMultiLanguageName } from '$lib/utils/language';
	import { primaryLanguage, secondaryLanguage, theme } from '$lib/stores/domain';
	import type { ITagPokemon } from '$lib/types/ITags';
	import { getPokemonEntry } from '$lib/data/games';
	import Icon from '$components/Icon.svelte';

	export let pokemon: ITagPokemon;
	export let showRemoveButton: boolean;
	export let onRemoveClick: () => void;
</script>

<div class="card clickable" id={`${pokemon.id}`}>
	<a
		href={`/pokemon/${pokemon.id}?shiny=${pokemon.shiny}${
			pokemon.gender ? `&gender=${pokemon.gender}` : ''
		}`}
	>
		<div class="spriteWrapper">
			<Image
				src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon${
					pokemon.shiny ? '/shiny' : ''
				}${pokemon.gender === 'female' ? '/female' : ''}/${pokemon.id}.png`}
				alt={`sprite`}
				loading="lazy"
				height="96px"
				width="96px"
			/>
		</div>

		<p>
			#{pokemon.id}
			{getMultiLanguageName(
				getPokemonEntry(pokemon.id).names,
				$primaryLanguage,
				$secondaryLanguage
			)}
		</p>
		{#if pokemon.gender === 'female'}
			<Icon
				name="venus"
				style={`padding-left: 10px; fill: ${$theme === 'dark' ? '#f6abd9' : '#ee5db7'};`}
			/>
		{:else}
			<Icon
				name="mars"
				style={`padding-left: 10px; fill: ${$theme === 'dark' ? '#99b3ff' : '#3366ff'};`}
			/>
		{/if}

		{#if pokemon.shiny}
			{#if $theme === 'light'}
				<Icon
					name="spark"
					style="margin-top: 1.25rem"
					lineStroke="var(--text)"
					pathStroke="var(--text)"
				/>
			{:else}
				<Icon
					name="spark-full"
					style="margin-top: 1.25rem"
					pathFill="var(--text)"
					lineStroke="var(--text)"
					pathStroke="var(--text)"
				/>
			{/if}
		{/if}
	</a>
	{#if showRemoveButton}
		<button class="removeButton" on:click={onRemoveClick}>-</button>
	{/if}
</div>

<style>
	a {
		text-decoration-line: unset;
		display: flex;
		align-items: center;
	}

	.card {
		position: relative;
		padding: 0.25rem;
		margin: 1rem;
	}

	.removeButton {
		position: absolute;
		top: 0;
		right: 0;
		text-align: center;
		height: 2rem;
		width: 2rem;
		border-radius: 10%;
		font-weight: bold;
		color: var(--light);
		background-color: var(--error);
		z-index: 5;
	}

	.spriteWrapper {
		height: 96px;
		width: 96px;
		padding: 1rem;
	}

	@media screen and (min-width: 768px) {
		.card {
			max-width: 45%;
		}
	}
</style>
