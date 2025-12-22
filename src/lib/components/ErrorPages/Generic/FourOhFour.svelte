<script>
	import { page } from '$app/state';
	import Feedback from '$/lib/components/ErrorPages/Feedback.svelte';
	import Image from '$/ui/atoms/Image.svelte';
</script>

<Image
	src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/201-question.png"
	alt="Question mark Incognito"
	style="margin-left: auto; margin-right: auto;"
/>

<h2 class="h2">{page.status} - This page could not be found</h2>

<p>{page.error?.message}</p>

<div id="errorDetail">
	<p>
		Sorry about that! The details above might give some indication as to what happened. If you think
		that this is a bug, please file an issue in the <a
			href="https://github.com/helblinglilly/pokecompanion">GitHub repo</a
		>
	</p>
</div>

<hr />

<div id="userFeedbackWrapper">
	<h2 class="h2" style="margin-bottom: 1rem;">Feedback</h2>
	<Feedback placeholder="Would you like to share how you got here?" />
</div>

<style>
	hr {
		margin-top: 2rem;
		margin-bottom: 2rem;
		color: var(--text);
	}
</style>
