<script lang="ts">
	import type { IRecordPokemon } from '$/lib/types/IPokemon';

	export let pokemon: IRecordPokemon;

	const queryParams = new URLSearchParams();
	$: {
		if (pokemon) {
			if (pokemon.gender) {
				queryParams.set('gender', pokemon.gender);
			} else {
				queryParams.delete('gender');
			}
			if (pokemon.shiny) {
				queryParams.set('shiny', 'true');
			} else {
				queryParams.delete('shiny');
			}
			if (pokemon.variety) {
				queryParams.set('variety', pokemon.variety);
			} else {
				queryParams.delete('variety');
			}
		}
	}
</script>

<a href={`/pokemon/${pokemon.id}?${queryParams.toString()}`} class="clickable">
	<slot />
</a>

<style>
	a {
		text-decoration-line: unset;
		width: 100%;
	}
</style>
