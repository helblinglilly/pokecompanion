<script lang="ts">
	export let title = 'Pokécompanion';
	export let description =
		'Explore the world of the Pokémon video games without the information overload. Set your game and never get lost in the flood of information again!';
	export let previewImage = '/socialpreview/generic.png';
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content={title} />
	<meta name="twitter:title" content={title} />

	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<meta name="twitter:description" content={description} />

	<meta property="og:type" content="website" />

	<meta property="og:url" content="https://pokecompanion.helbling.uk" />
	<meta property="twitter:url" content="https://pokecompanion.helbling.uk" />
	<meta property="twitter:domain" content="pokecompanion.helbling.uk" />

	<meta name="twitter:card" content="summary_large_image" />

	<meta property="og:image" content={previewImage} />
	<meta name="twitter:image" content={previewImage} />
</svelte:head>
