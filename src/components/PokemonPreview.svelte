<script lang="ts">
	import { primaryLanguage, secondaryLanguage } from '$lib/domain';
	import { getMultiLanguageName } from '$lib/utils/language';
	import type { IPokemonNames } from '../routes/pokemon/+page.server';

	export let pokemon: IPokemonNames;
</script>

<a href={`/pokemon/${pokemon.id}`} class="no-style">
	<div class="card" style="display: flex; align-items: center;">
		<img
			src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
			alt="sprite"
			height="96"
			width="96"
		/>
		<p>
			#{pokemon.id}
			{getMultiLanguageName(pokemon.names, $primaryLanguage, $secondaryLanguage)}
		</p>
	</div>
</a>
