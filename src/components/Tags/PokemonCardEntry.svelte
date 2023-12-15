<script lang="ts">
	import { getMultiLanguageName } from '$lib/utils/language';
	import Image from '$components/Image.svelte';
	import { primaryLanguage, secondaryLanguage, theme } from '$lib/stores/domain';
	import type { ITagPokemon } from '$lib/types/ITags';
	import { getPokemonEntry } from '$lib/data/games';
	import Icon from '$components/Icon.svelte';

	export let pokemon: ITagPokemon;
	export let showRemoveButton: boolean;
	export let showGenderAndShiny: boolean;
	export let onRemoveClick: () => void;
</script>

<div class="card" id={`${pokemon.id}`}>
	<a
		href={`/pokemon/${pokemon.id}?shiny=${pokemon.shiny}${
			pokemon.gender ? `&gender=${pokemon.gender}` : ''
		}`}
		class="clickable"
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
		<p>#{pokemon.id}</p>
		<p>
			{getMultiLanguageName(
				getPokemonEntry(pokemon.id).names,
				$primaryLanguage,
				$secondaryLanguage
			)}
		</p>
	</a>
	{#if showRemoveButton}
		<button class="removeButton" on:click={onRemoveClick}>-</button>
	{/if}

	{#if showGenderAndShiny}
		<div class="indicators">
			{#if pokemon.gender === 'female'}
				<Icon
					name="venus"
					style={`padding-left: 10px; fill: ${$theme === 'dark' ? '#f6abd9' : '#ee5db7'};`}
				/>
			{:else if pokemon.gender === 'male'}
				<Icon
					name="mars"
					style={`padding-left: 10px; fill: ${$theme === 'dark' ? '#99b3ff' : '#3366ff'};`}
				/>
			{/if}

			{#if pokemon.shiny}
				{#if $theme === 'light'}
					<Icon
						name="spark"
						style="margin-top: -0.25rem;"
						lineStroke="var(--text)"
						pathStroke="var(--text)"
					/>
				{:else}
					<Icon
						style="margin-top: -0.25rem;"
						name="spark-full"
						pathFill="var(--text)"
						lineStroke="var(--text)"
						pathStroke="var(--text)"
					/>
				{/if}
			{/if}
		</div>
	{/if}
</div>

<style>
	a {
		padding: 2em;
		text-decoration-line: unset;
		border-radius: 10px;
	}

	a > p {
		text-align: center;
		position: relative;
	}

	.card {
		position: relative;
		margin: 1rem;
		flex: 1;
		height: 200px;
		width: 200px;
		display: grid;
		justify-content: center;
		align-content: center;
		text-decoration: none;
		padding: 0;
		max-width: fit-content;
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

	.indicators {
		position: absolute;
		top: 0;
		left: 0;
		text-align: center;
		height: 2rem;
		width: 100%;
		border-radius: 10%;
		z-index: 5;
		display: inline-flex;
		margin-top: 0.5rem;
	}

	.spriteWrapper {
		height: 96px;
		width: 96px;
		margin-left: auto;
		margin-right: auto;
	}
</style>
