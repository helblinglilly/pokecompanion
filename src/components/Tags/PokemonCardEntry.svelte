<script lang="ts">
	import { getMultiLanguageName } from '$lib/utils/language';
	import Image from '$components/Image.svelte';
	import { primaryLanguage, secondaryLanguage } from '$lib/stores/domain';
	import type { ITagPokemon } from '$lib/types/ITags';
	import { getPokemonEntry } from '$lib/data/games';

	export let pokemon: ITagPokemon;
	export let showRemoveButton: boolean;
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

	.spriteWrapper {
		height: 96px;
		width: 96px;
	}
</style>
