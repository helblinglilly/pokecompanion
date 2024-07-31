<script lang="ts">
	import { selectedGame, versionSpecificPokemonSprites } from '$/lib/stores/domain';
	import Image from '$/components/UI/Image.svelte';

	export let id: number;
	export let shiny: boolean = false;
	export let female: boolean = false;
	export let variety: string = '';

	const fallbackSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

	async function getSpriteURL() {
		const res = await fetch(
			`/api/pokemon/${id}/sprite?gender=${female ? 'female' : 'male'}&shiny=${
				shiny ? 'true' : 'false'
			}&game=${
				$selectedGame && $versionSpecificPokemonSprites ? $selectedGame.pokeapi : 'generic'
			}&variety=${variety}`
		);
		if (res.ok) {
			return await res.text();
		}
		return fallbackSpriteUrl;
	}
</script>

<div class="spriteWrapper">
	{#await getSpriteURL()}
		<Image src={'/placeholder.png'} alt={`sprite`} loading="lazy" height="96px" width="96px" />
	{:then spriteURL}
		<Image
			classNames="ml-auto mr-auto max-w-full w-auto"
			src={spriteURL}
			alt={`sprite`}
			loading="lazy"
			height="96px"
			width="auto"
			style="height: inherit;"
		/>
	{:catch}
		<p>Something went wrong</p>
	{/await}
</div>
