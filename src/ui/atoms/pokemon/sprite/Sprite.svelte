<script lang="ts">
	import type { IGameGroups } from '$/lib/data/games';
	import { selectedGame, versionSpecificPokemonSprites } from '$/lib/stores/domain';
	import Image from '$/ui/atoms/image/Image.svelte';

	export let id: number;
	export let shiny: boolean = false;
	export let female: boolean = false;
	export let variety: string = '';
	export let style: string = '';
	export let gameOverride: IGameGroups | undefined = undefined;
	export let imageClasses: string = '';

	const fallbackSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

	async function getSpriteURL(id: number, shiny: boolean, female: boolean, variety: string) {
		const res = await fetch(
			`/api/pokemon/${id}/sprite?gender=${female ? 'female' : 'male'}&shiny=${
				shiny ? 'true' : 'false'
			}&game=${
				gameOverride
					? gameOverride.pokeapi
					: $selectedGame && $versionSpecificPokemonSprites
					? $selectedGame.pokeapi
					: 'generic'
			}&variety=${variety}`
		);
		if (res.ok) {
			return await res.text();
		}
		return fallbackSpriteUrl;
	}
</script>

<div class="spriteWrapper" {style}>
	{#await getSpriteURL(id, shiny, female, variety)}
		<Image src={'/placeholder.png'} alt={`sprite`} loading="lazy" height="96px" width="96px" />
	{:then spriteURL}
		<Image
			classNames={`${imageClasses} ml-auto mr-auto max-w-full w-auto`}
			src={spriteURL}
			alt={`sprite`}
			loading="lazy"
			height="auto"
			width="96px"
			style="width: inherit;"
		/>
	{:catch}
		<p>Something went wrong</p>
	{/await}
</div>
