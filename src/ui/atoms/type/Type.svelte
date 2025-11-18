<script lang="ts">
	import type { PokeapiVersionGroups } from '$/@types/api.pokecompanion';
	import { selectedGame, versionSpecificTypeSprites } from '$/lib/stores/domain';
	import Image from '$/ui/atoms/image';

	export let type: string;
	export let style = '';
	export let className = '';
	export let game: PokeapiVersionGroups | undefined = undefined;

	const baseURL = `https://sprites.pokecompanion.com/types`;

	$: specificGame = game ?? $selectedGame?.pokeapi;
	$: src = `${baseURL}${
		specificGame && $versionSpecificTypeSprites ? '/' + specificGame : ''
	}/${type}.png`;
</script>

<Image
	{src}
	fallback={`${baseURL}/${type}.png`}
	alt={type}
	style={`${style} object-fit: contain; max-width: 5rem;`}
	classNames={className ?? undefined}
/>
