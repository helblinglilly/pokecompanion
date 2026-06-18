<script lang="ts">
	import FeedbackDiscord from '$/lib/components/ErrorPages/FeedbackDiscord.svelte';
</script>

<svelte:head>
	<title>Feedback | Pokécompanion</title>
</svelte:head>

<div class="justify-center grid gap-8">
	<h1 class="h1">Thanks for testing out Pokécompanion!</h1>

	<h2 class="h2">Share what worked, what did not, or what you would like to see next</h2>

	<FeedbackDiscord placeholder="How easy is it to use? Is it useful? Did you have any issues?" />
</div>
