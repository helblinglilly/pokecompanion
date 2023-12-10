<script lang="ts">
	import { getMultiLanguageName, type Languages } from '$lib/utils/language';
	import Image from '$components/Image.svelte';
	import { primaryLanguage, secondaryLanguage } from '$lib/stores/domain';

	export let id: number;
	export let names: Languages[];
	export let showRemoveButton: boolean;
	export let onRemoveClick: () => void;
</script>

<div class="card" id={`${id}`}>
	<a href={`/pokemon/${id}`} class="clickable">
		<div class="spriteWrapper">
			<Image
				src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
				alt={`sprite`}
				loading="lazy"
				height="96px"
				width="96px"
			/>
		</div>
		<p>#{id}</p>
		<p>
			{getMultiLanguageName(names, $primaryLanguage, $secondaryLanguage)}
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
