<script lang="ts">
	import { selectedGame, versionSpecificTypeSprites } from '$/lib/stores/domain';
	import Image from './UI/Image.svelte';

	export let type: string;
	export let style: string = '';
	export let className: string = '';

	const baseURL = `https://sprites.pokecompanion.com/types`;
</script>

<Image
	src={`${baseURL}${
		$selectedGame?.pokeapi && $versionSpecificTypeSprites ? '/' + $selectedGame.pokeapi : ''
	}/${type}.png`}
	fallback={`${baseURL}/${type}.png`}
	alt={type}
	style={`${style} object-fit: contain; max-width: 5rem;`}
	classNames={className ?? undefined}
/>
