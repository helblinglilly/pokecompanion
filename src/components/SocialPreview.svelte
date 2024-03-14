<script lang="ts">
	let defaultTitle = 'Pokécompanion';
	export let title = defaultTitle;
	export let description =
		'Explore the world of the Pokémon video games without the information overload. Set your game and never get lost in the flood of information again!';
	export let previewImage = '/socialpreview/generic.png';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{title === defaultTitle ? title : title + ' - ' + defaultTitle}</title>
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

	<meta property="og:image" content={`${$page.url.origin}${previewImage}`} />
	<meta name="twitter:image" content={`${$page.url.origin}${previewImage}`} />
</svelte:head>
