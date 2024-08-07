<script lang="ts">
	import type { PokeapiVersionGroups } from '$/lib/data/games';
	import { selectedGame, versionSpecificTypeSprites } from '$/lib/stores/domain';
	import Image from '$/ui/atoms/image';

	export let type: string;
	export let style: string = '';
	export let className: string = '';
	export let game: PokeapiVersionGroups | undefined = $selectedGame?.pokeapi;

	const baseURL = `https://sprites.pokecompanion.com/types`;
</script>

<Image
	src={`${baseURL}${game && $versionSpecificTypeSprites ? '/' + game : ''}/${type}.png`}
	fallback={`${baseURL}/${type}.png`}
	alt={type}
	style={`${style} object-fit: contain; max-width: 5rem;`}
	classNames={className ?? undefined}
/>
