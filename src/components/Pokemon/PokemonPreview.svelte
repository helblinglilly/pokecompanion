<script lang="ts">
	import { primaryLanguage, secondaryLanguage } from '$lib/stores/domain';
	import { getLanguageEntry, getMultiLanguageName, type Languages } from '$lib/utils/language';
	import Image from '$/components/UI/Image.svelte';
	import { getPokemonEntry } from '$lib/data/games';

	export let pokemon: {
		id: number;
		names?: Languages[];
	};

	$: pokemonEntry = getPokemonEntry(pokemon.id);
</script>

<a
	href={`/pokemon/${pokemonEntry.redirect}`}
	class="no-style"
	id={pokemonEntry.redirect ? pokemonEntry.redirect : pokemonEntry.id.toString()}
>
	<div
		class="card clickable"
		style="display: flex; align-items: center; padding: 1rem; margin-top: 1rem;"
	>
		<div class="spriteWrapper">
			<Image
				src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
				alt={`${getLanguageEntry(pokemonEntry.names, $primaryLanguage)} sprite`}
				loading="lazy"
				height="96px"
				width="96px"
			/>
		</div>
		<p>
			#{pokemonEntry.id}
			{getMultiLanguageName(pokemonEntry.names, $primaryLanguage, $secondaryLanguage)}
		</p>
	</div>
</a>

<style>
	a {
		width: 100%;
	}
</style>
