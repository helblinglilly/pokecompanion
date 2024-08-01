<script>
	import { page } from '$app/stores';
	import Image from '$/ui/atoms/image/Image.svelte';
	import { Logger } from '$lib/log';
	import { onMount } from 'svelte';

	onMount(async () => {
		await Logger.addPageAction('ErrorBoundary', 'Pokemon404', {
			error: $page.error?.message
		});
	});
</script>

<div id="errorHeader">
	<Image
		src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/201-question.png"
		alt="Question mark Incognito"
		style="margin-left: auto; margin-right: auto;"
	/>

	<h1 class="h1">404</h1>
	<h2 class="h2">Who's that Pokémon?</h2>

	<div id="errorDetail">
		<p>Sorry, we don't recognise a Pokémon with this National Pokédex ID.</p>
		<br />
		<p>
			This site gets updated weekly. If a new game has just been released its Pokémon should show up
			soon!
		</p>
	</div>
</div>
