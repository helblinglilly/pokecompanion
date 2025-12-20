<script lang="ts">
	import { page } from '$app/stores';
	export let title = 'Pokécompanion';
	export let description = `Explore the world from Kanto to Lumiose City efficiently with Pokécompanion. Browsing and organising Pokémon, Moves, Abilities and more in a Rapidash!`;
	export let previewImage = 'https://socialpreviews.pokecompanion.helbling.uk/generic.png';
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content={title} />
	<meta name="twitter:title" content={title} />

	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<meta name="twitter:description" content={description} />

	<meta property="og:type" content="website" />

	<meta property="og:url" content={$page.url.origin} />
	<meta property="twitter:url" content={$page.url.origin} />
	<meta property="twitter:domain" content={$page.url.hostname} />

	<meta name="twitter:card" content="summary_large_image" />

	<meta property="og:image" content={previewImage} />
	<meta name="twitter:image" content={previewImage} />
</svelte:head>
