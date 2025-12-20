<script lang="ts">
	import type { PokeapiVersionGroups } from '$/@types/api.pokecompanion';
	import { selectedGame, versionSpecificTypeSprites } from '$/lib/stores/domain';
	import Image from '$/ui/atoms/image';

	interface Props {
		type: string;
		style?: string;
		className?: string;
		game?: PokeapiVersionGroups | undefined;
	}

	let { type, style = '', className = '', game = undefined }: Props = $props();

	const baseURL = `https://sprites.pokecompanion.com/types`;

	let specificGame = $derived(game ?? $selectedGame?.pokeapi);
	let src = $derived(
		`${baseURL}${specificGame && $versionSpecificTypeSprites ? '/' + specificGame : ''}/${type}.png`
	);
</script>

<Image
	{src}
	fallback={`${baseURL}/${type}.png`}
	alt={type}
	style={`${style} object-fit: contain; max-width: 5rem;`}
	classNames={className ?? undefined}
/>
