<script lang="ts">
	import { selectedGame, versionSpecificTypeSprites } from '$/lib/stores/domain';
	import Image from './UI/Image.svelte';

	export let type: string;
	export let style: string = '';
	export let className: string = '';

	const damageClasses = ['physical', 'special', 'status'];
	const baseURL = `https://sprites.pokecompanion.com/types`;
</script>

<div class="flex items-center justify-center">
	<Image
		src={`${baseURL}${
			$selectedGame?.pokeapi && $versionSpecificTypeSprites ? '/' + $selectedGame.pokeapi : ''
		}/${type}.png`}
		fallback={`${baseURL}/${type}.png`}
		alt={type}
		style={`${style} width: 100%; height: auto; object-fit: contain; min-height: 20px; max-width: 100px;`}
		classNames={className ?? undefined}
	/>
</div>
