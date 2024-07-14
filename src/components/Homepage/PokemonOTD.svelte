<script lang="ts">
	/**
	 * Styling:
	 * Tailwind will take a while to load and apply, especially on slower network
	 * conntections
	 *
	 * Styling elements that affect the layout have been done inline to avoid
	 * layout shift as the site/assets load in
	 *
	 */
	import { getMultiLanguageName } from '$lib/utils/language';
	import Image from '$/components/UI/Image.svelte';
	import {
		animateSprites,
		primaryLanguage,
		secondaryLanguage,
		selectedGame,
		versionSpecificPokemonSprites
	} from '$lib/stores/domain';
	import { getPokemonEntry, type IGameGroups } from '$lib/data/games';
	import { onMount } from 'svelte';
	import Card from '$/ui/atoms/card/Card.svelte';

	export let pokemon: number;
	let sprite: string | undefined;

	async function getSpriteURL(shiny: boolean, game: IGameGroups | undefined) {
		const queryParamsCopy = new URLSearchParams(queryParams.toString());
		queryParamsCopy.set('shiny', `${shiny}`);

		if ($versionSpecificPokemonSprites === true && game) {
			queryParamsCopy.set('game', game.pokeapi);

			if ($animateSprites) {
				queryParamsCopy.set('animate', $animateSprites ? 'true' : 'false');
			}
		}

		const res = await fetch(`/api/pokemon/${pokemon}/sprite?${queryParamsCopy.toString()}`);
		if (res.ok) {
			return await res.text();
		}
		return fallbackSpriteUrl;
	}

	onMount(async () => {
		const shiny = Math.random() < 0.01 && pokemon < 888;
		sprite = await getSpriteURL(shiny, $selectedGame);
	});

	const queryParams = new URLSearchParams();

	const fallbackSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon}.png`;
</script>

<Card isClickable classes="relative no-underline p-0 h-full" style="max-height: 12rem;">
	<a
		href={`/pokemon/${pokemon}?${queryParams.toString()}`}
		class="block no-underline clickable p-4 rounded-lg"
		style="height: 100%; width: 100%;"
	>
		<div
			class="content-center"
			style="height: 96px; width: 96px; margin-left: auto; margin-right: auto;"
		>
			{#await getSpriteURL(false, $selectedGame)}
				<Image src={'/placeholder.png'} alt={`sprite`} loading="eager" height="96px" width="96px" />
			{:then spriteURL}
				<Image
					classNames="ml-auto mr-auto"
					src={spriteURL}
					alt={`sprite`}
					loading="lazy"
					height="48px"
					width="auto"
				/>
			{/await}
		</div>
		<p class="text-center relative">#{pokemon}</p>
		<p class="text-center relative">
			{getMultiLanguageName(getPokemonEntry(pokemon).names, $primaryLanguage, $secondaryLanguage)}
		</p>
	</a>
</Card>
