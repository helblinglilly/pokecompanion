<script lang="ts">
	import { primaryLanguage, secondaryLanguage } from '$lib/domain';
	import { getLanguageEntry, getMultiLanguageName } from '$lib/utils/language';
	import type { IPokemonNames } from '../routes/pokemon/+page';

	export let pokemon: IPokemonNames;
</script>

<a href={`/pokemon/${pokemon.id}`} class="no-style" id={`pokemon-preview-${pokemon.id}`}>
	<div
		class="card clickable"
		style="display: flex; align-items: center; padding: 1rem; margin-top: 1rem;"
	>
		<div class="spriteWrapper">
			<img
				src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
				alt={`${getLanguageEntry(pokemon.names, $primaryLanguage)} sprite`}
				loading="lazy"
				height="96px"
				width="96px"
			/>
		</div>
		<p>
			#{pokemon.id}
			{getMultiLanguageName(pokemon.names, $primaryLanguage, $secondaryLanguage)}
		</p>
	</div>
</a>
