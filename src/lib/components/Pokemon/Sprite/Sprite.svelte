<script lang="ts">
	import type { UserPreferencePokemonVersion } from '$/lib/stores/domain';
	import type { ISpriteData } from './types';

	export let sprites: ISpriteData;
	export let isFemale: boolean = false;
	export let isShiny: boolean = false;
	export let isSecondary: boolean = false;
	export let game: UserPreferencePokemonVersion = 'generic';

	const baseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
</script>
