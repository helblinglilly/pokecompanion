<script lang="ts">
	import Image from '$components/Image.svelte';
	import { getMultiLanguageName, type Languages } from '$lib/utils/language';
	import { primaryLanguage, secondaryLanguage } from '$lib/stores/domain';

	export let id: number;
	export let names: Languages[];
	export let showRemoveButton: boolean;
	export let onRemoveClick: () => void;
</script>

<div class="card clickable" id={`${id}`}>
	<a href={`/pokemon/${id}`}>
		<div class="spriteWrapper">
			<Image
				src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
				alt={`sprite`}
				loading="lazy"
				height="96px"
				width="96px"
			/>
		</div>

		<p>
			#{id}
			{getMultiLanguageName(names, $primaryLanguage, $secondaryLanguage)}
		</p>
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
