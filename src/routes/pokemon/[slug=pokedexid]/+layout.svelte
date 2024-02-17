<script lang="ts">
	import { page } from '$app/stores';

	const pokemonId = $page.url.pathname.split('/pokemon/')[1];
	const showFemale = $page.url.searchParams.get('gender') === 'female';
	const showMale = $page.url.searchParams.get('gender') === 'male';
	const showShiny = $page.url.searchParams.get('shiny') === 'true';

	let filename =
		showFemale && !showShiny
			? 'female'
			: showFemale && showShiny
			? 'shiny-female'
			: showMale && !showShiny
			? 'male'
			: showMale && showShiny
			? 'shiny-male'
			: 'generic';
</script>

<svelte:head>
	<meta property="og:image" content={`/socialpreview/pokemon/${pokemonId}/${filename}.png`} />
	<meta name="twitter:image" content={`/socialpreview/pokemon/${pokemonId}/${filename}.png`} />
</svelte:head>

<slot />
