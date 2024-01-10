<script lang="ts">
	import { primaryLanguage, secondaryLanguage } from '$lib/stores/domain';
	import { getLanguageEntry, getMultiLanguageName, type Languages } from '$lib/utils/language';
	import Image from '$components/UI/Image.svelte';
	import { getPokemonEntry } from '$lib/data/games';

	export let pokemon: {
		id: number;
		names?: Languages[];
	};

	$: names = pokemon.names ?? getPokemonEntry(pokemon.id).names;
</script>

<a href={`/pokemon/${pokemon.id}`} class="no-style" id={`${pokemon.id}`}>
	<div
		class="card clickable"
		style="display: flex; align-items: center; padding: 1rem; margin-top: 1rem;"
	>
		<div class="spriteWrapper">
			<Image
				src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
				alt={`${getLanguageEntry(names, $primaryLanguage)} sprite`}
				loading="lazy"
				height="96px"
				width="96px"
			/>
		</div>
		<p>
			#{pokemon.id}
			{getMultiLanguageName(names, $primaryLanguage, $secondaryLanguage)}
		</p>
	</div>
</a>
