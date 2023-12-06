<script lang="ts">
	import PokemonPreview from '$components/Pokemon/PokemonPreview.svelte';
	import { getPokemonEntry } from '$lib/data/games';

	export let id: number;
	export let added: Date;
	export let onRemoveClick: Function;
</script>

<tr>
	<td class="entry" style="padding-left: 0;">
		<PokemonPreview pokemon={{ id, names: getPokemonEntry(id).names }} />
		<p>{added.toLocaleString()}</p>
	</td>
	<td class="tight" style="padding-right: 0;">
		<button class="removeButton" on:click={(e) => onRemoveClick()}>-</button>
	</td>
</tr>

<style>
	td {
		padding: 0.5rem;
	}
	.removeButton {
		display: grid;
		text-align: center;
		align-content: center;
		height: 2.5rem;
		width: 2.5rem;
		border-radius: 100%;
		font-weight: bold;

		color: var(--light);
		background-color: var(--error);
	}

	.entry {
		font-size: smaller;
	}

	.tight {
		max-width: 2rem;
	}
</style>
